import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';

import { SchemasService } from '../schemas/schemas.service';

const SCHEMA = 'schema';

const filterColumns = async (resource, item, repository) => {
  const { entities } = await repository.findById(resource);
  const keys = Object.keys(
    entities
      .map((e) => new Function(`return ${e}`)())
      .find(({ name }) => name === resource).columns
  );
  return Object.fromEntries(
    Object.entries(item).filter(([k]) => keys.includes(k))
  );
};

@Injectable()
@Dependencies(ConfigService, SchemasService)
export class ImportService {
  logger = new Logger(ImportService.name);

  constructor(configService, schemasService) {
    this.root = configService.get('resources.imp.path');
    this.schemasService = schemasService;
  }

  async imp() {
    if (!fs.existsSync(this.root)) {
      return;
    }
    this.logger.log('Import schema');
    await this.consume(
      (resource) => resource === SCHEMA,
      (id) => id === SCHEMA,
      (item) => item
    );
    this.logger.log('Import schemas');
    await this.consume(
      (resource) => resource === SCHEMA,
      (id) => id !== SCHEMA,
      (item) => item
    );
    this.logger.log('Import items without relations');
    await this.consume(
      (resource) => resource !== SCHEMA,
      () => true,
      (item, resource) =>
        filterColumns(resource, item, this.schemasService.getRepository(SCHEMA))
    );
    this.logger.log('Import items');
    await this.consume(
      (resource) => resource !== SCHEMA,
      () => true,
      (item) => item
    );
    this.logger.log('End import');
  }

  async consume(resourceFilter, idFilter, transformer) {
    for (const resource of fs.readdirSync(this.root)) {
      if (resourceFilter(resource)) {
        const resourcePath = path.join(this.root, resource);
        const stat = fs.statSync(resourcePath);
        if (stat.isDirectory()) {
          for (const file of fs.readdirSync(resourcePath)) {
            const { name, ext } = path.parse(file);
            if (idFilter(name) && ext === '.json') {
              const filePath = path.join(resourcePath, file);
              const dto = fs.readFileSync(filePath);
              const item = JSON.parse(dto);
              const transformed = await transformer(item, resource);
              await this.schemasService.save(resource, transformed);
            }
          }
        }
      }
    }
  }
}
