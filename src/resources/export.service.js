import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import JSZip from 'jszip';
import { pipeline } from 'stream/promises';

import { SchemasService } from '../schemas/schemas.service';
import { StorageService } from '../storage/storage.service';

const SCHEMA = 'schema';
const DATA_FOLDER = 'data';
const FILES_FOLDER = 'files';

@Injectable()
@Dependencies(ConfigService, SchemasService, StorageService)
export class ExportService {
  logger = new Logger(ExportService.name);

  constructor(configService, schemasService, storageService) {
    this.properties = configService.get('resources.exp');
    this.schemasService = schemasService;
    this.storageService = storageService;
  }

  async exp() {
    const name = `${this.name()}.zip`;
    this.logger.log(`Start export ${name} ...`);
    const zip = new JSZip();
    const filesFolder = zip.folder(FILES_FOLDER);
    const dataFolder = zip.folder(DATA_FOLDER);
    const repository = this.schemasService.getRepository(SCHEMA);
    const schemas = await repository.find();
    for (const resource of schemas.map(({ id }) => id)) {
      const resourceFolder = dataFolder.folder(resource);
      const itemRepository = this.schemasService.getRepository(resource);
      for await (const item of this.findAll(itemRepository)) {
        const id = itemRepository.getId(item);
        const data = JSON.stringify(item, (k, v) => (v ? v : undefined), 2);
        resourceFolder.file(`${id}.json`, data);
        for (const origin of this.storageService.getFilenames(item)) {
          filesFolder.file(path.basename(origin), fs.createReadStream(origin));
        }
      }
    }
    await pipeline(
      zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }),
      fs.createWriteStream(name)
    );
    this.logger.log('End export');
    this.clean();
  }

  clean() {
    this.logger.log('Start clean ...');
    const size = this.list().length - this.properties.limit;
    if (size > 0) {
      this.delete(size);
    }
    this.logger.log('End clean');
  }

  list() {
    return fs.existsSync(this.properties.path)
      ? fs.readdirSync(this.properties.path)
      : [];
  }

  delete(size) {
    for (const p of this.list().sort().slice(0, size)) {
      fs.rmSync(path.join(this.properties.path, p));
    }
  }

  name() {
    fs.mkdirSync(this.properties.path, { recursive: true });
    const name = moment().format(this.properties.pattern);
    return path.join(this.properties.path, name);
  }

  findAll(repository) {
    let index = 0;
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            const value = await repository.findOne({
              skip: index++,
              take: 1,
              where: {}
            });
            return { value, done: !value };
          }
        };
      }
    };
  }
}
