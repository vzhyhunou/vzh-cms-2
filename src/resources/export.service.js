import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import AdmZip from 'adm-zip';

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
    const zip = new AdmZip();
    for (const resource of await this.schemasService.findSchemaIds()) {
      for await (const item of await this.schemasService.getIterator(
        resource
      )) {
        const id = this.schemasService.getId(resource, item);
        const data = JSON.stringify(item, (k, v) => (v ? v : undefined), 2);
        zip.addFile(
          path.join(DATA_FOLDER, resource, `${id}.json`),
          Buffer.from(data)
        );
        for (const origin of this.storageService.getFilenames(item)) {
          zip.addLocalFile(origin, FILES_FOLDER);
        }
      }
    }
    zip.writeZip(name);
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
}
