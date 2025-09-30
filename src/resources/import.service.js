import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

import { SchemasService } from '../schemas/schemas.service';
import { StorageService } from '../storage/storage.service';

const SCHEMA = 'schema';
const DATA_FOLDER = 'data';
const FILES_FOLDER = 'files';

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
@Dependencies(ConfigService, SchemasService, StorageService)
export class ImportService {
  logger = new Logger(ImportService.name);

  constructor(configService, schemasService, storageService) {
    this.path = configService.get('resources.imp.path');
    this.schemasService = schemasService;
    this.storageService = storageService;
  }

  async imp() {
    if (!fs.existsSync(this.path)) {
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
    var zip = new AdmZip(this.path);
    for (const entry of zip.getEntries()) {
      const { entryName } = entry;
      const [folder, resource, file] = entryName.split(path.sep);
      switch (folder) {
        case DATA_FOLDER:
          const { name } = path.parse(file);
          if (resourceFilter(resource) && idFilter(name)) {
            const dto = zip.readAsText(entry);
            const item = JSON.parse(dto);
            const transformed = await transformer(item, resource);
            await this.schemasService.save(resource, transformed);
          }
          break;
        case FILES_FOLDER:
          zip.extractEntryTo(entryName, this.storageService.path, false, true);
      }
    }
  }
}
