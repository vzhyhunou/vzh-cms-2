import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';
import moment from 'moment';

import { SchemasService } from '../schemas/schemas.service';
import entity from '../schemas/schema.entity.json';

@Injectable()
@Dependencies(ConfigService, SchemasService)
export class ExportService {
  logger = new Logger(ExportService.name);

  constructor(configService, service) {
    this.properties = configService.get('resources.exp');
    this.service = service;
  }

  async exp() {
    const dir = this.folder();
    this.logger.log(`Start export ${dir} ...`);
    const repository = this.service.getRepository(entity.id);
    const schemas = await repository.find();
    for (const resource of schemas.map(({ id }) => id)) {
      const itemRepository = this.service.getRepository(resource);
      for await (const item of this.findAll(itemRepository)) {
        const resourcepath = path.join(dir, resource);
        fs.mkdirSync(resourcepath, { recursive: true });
        const id = itemRepository.getId(item);
        if (id !== entity.id) {
          const filepath = path.join(resourcepath, `${id}.json`);
          fs.writeFileSync(
            filepath,
            JSON.stringify(item, (k, v) => (v ? v : undefined), 2)
          );
        }
      }
    }
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
      fs.rmSync(path.join(this.properties.path, p), { recursive: true });
    }
  }

  folder() {
    const folder = moment().format(this.properties.pattern);
    return path.join(this.properties.path, folder);
  }

  findAll(repository) {
    let index = 0;
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            const value = await repository.findByIndex(index++);
            return { value, done: !value };
          }
        };
      }
    };
  }
}
