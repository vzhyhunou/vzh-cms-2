import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';

import { SchemasService } from '../schemas/schemas.service';
import schemaEntity from '../schemas/schema.entity.json';

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
    this.logger.log('Import schemas');
    await this.consume(
      (resource) => resource === schemaEntity.id,
      (item) => item
    );
    this.logger.log('Import items without relations');
    await this.consume(
      (resource) => resource !== schemaEntity.id,
      (item, resource) =>
        filterColumns(
          resource,
          item,
          this.schemasService.getRepository(schemaEntity.id)
        )
    );
    this.logger.log('Import items');
    await this.consume(
      (resource) => resource !== schemaEntity.id,
      (item) => item
    );
    this.logger.log('End import');
  }

  async consume(resourceFilter, transformer) {
    for (const resource of fs.readdirSync(this.root)) {
      if (resourceFilter(resource)) {
        const resourcePath = path.join(this.root, resource);
        const stat = fs.statSync(resourcePath);
        if (stat.isDirectory()) {
          for (const file of fs.readdirSync(resourcePath)) {
            const { ext } = path.parse(file);
            if (ext === '.json') {
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
