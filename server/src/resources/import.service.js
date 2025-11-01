import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import AdmZip from 'adm-zip';
import { AbstractImportService } from '@vzhyhunou/vzh-cms-common-2';

import { SchemasService } from '../schemas/schemas.service';
import { StorageService } from '../storage/storage.service';

const RESOURCES_FOLDER = 'resources';
const STATIC_FOLDER = 'static';

@Injectable()
@Dependencies(ConfigService, SchemasService, StorageService)
export class ImportService extends AbstractImportService {
  constructor(configService, schemasService, storageService) {
    super(schemasService, new Logger(ImportService.name));
    this.path = configService.get('resources.imp.path');
    this.storageService = storageService;
  }

  async consume(resourceFilter, idFilter, transformer) {
    var zip = new AdmZip(this.path);
    for (const entry of zip.getEntries()) {
      const { entryName, isDirectory } = entry;
      if (!isDirectory) {
        const [folder, resource, file] = entryName.split(path.sep);
        switch (folder) {
          case RESOURCES_FOLDER: {
            const { name } = path.parse(file);
            if (resourceFilter(resource) && idFilter(name)) {
              const dto = zip.readAsText(entry);
              const item = JSON.parse(dto);
              const transformed = await transformer(item, resource);
              await this.schemasService.save(resource, transformed);
            }
            break;
          }
          case STATIC_FOLDER: {
            zip.extractEntryTo(
              entryName,
              this.storageService.path,
              false,
              true
            );
          }
        }
      }
    }
  }
}
