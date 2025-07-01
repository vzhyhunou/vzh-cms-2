import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';

import { SchemasService } from '../schemas/schemas.service';

const SCHEMA = 'schema';

@Injectable()
@Dependencies(ConfigService, SchemasService)
export class ImportService {
  logger = new Logger(ImportService.name);

  constructor(configService, service) {
    this.root = configService.get('resources.imp.path');
    this.service = service;
  }

  async imp() {
    if (!fs.existsSync(this.root)) {
      return;
    }
    this.logger.log('Import schemas');
    await this.consume(
      (resource) => resource === SCHEMA,
      (f) => f,
      async (f) => {
        const { data } = f;
        if (!data) {
          return;
        }
        for (const { name, rows } of data.map((e) =>
          new Function(`return ${e}`)()
        )) {
          const repository = this.service.getRepository(name);
          await repository.save(rows);
        }
      }
    );
    this.logger.log('Import items without relations');
    const repository = this.service.getRepository(SCHEMA);
    await this.consume(
      (resource) => resource !== SCHEMA,
      async (f, resource) => {
        const { entities } = await repository.findById(resource);
        const { columns } = entities
          .map((e) => new Function(`return ${e}`)())
          .find(({ name }) => name === resource);
        return Object.fromEntries(
          Object.entries(f).filter(([k]) => Object.keys(columns).includes(k))
        );
      },
      () => {}
    );
    this.logger.log('Import items');
    await this.consume(
      (resource) => resource !== SCHEMA,
      (f) => f,
      () => {}
    );
    this.logger.log('End import');
  }

  async consume(filter, transformer, post) {
    for (const resource of fs.readdirSync(this.root)) {
      if (filter(resource)) {
        const resourcepath = path.join(this.root, resource);
        const stat = fs.statSync(resourcepath);
        if (stat.isDirectory()) {
          const repository = this.service.getRepository(resource);
          for (const file of fs.readdirSync(resourcepath)) {
            const filepath = path.join(resourcepath, file);
            if (filepath.endsWith('.json')) {
              let f = fs.readFileSync(filepath);
              f = JSON.parse(f);
              f = await transformer(f, resource);
              await repository.save(f);
              await post(f);
            }
          }
        }
      }
    }
  }
}
