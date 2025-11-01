import { AbstractImportService } from '@vzhyhunou/vzh-cms-common-2';

import data from './data';

const FILE = 'file';

export class ImportService extends AbstractImportService {
  constructor(schemasService) {
    super(schemasService, console);
  }

  async consume(resourceFilter, idFilter, transformer) {
    for (const [resource, items] of Object.entries(data)) {
      for (const [name, item] of Object.entries(items)) {
        switch (resource) {
          case FILE: {
            await this.schemasService.save(FILE, item);
            break;
          }
          default: {
            if (resourceFilter(resource) && idFilter(name)) {
              const transformed = await transformer(item, resource);
              await this.schemasService.save(resource, transformed);
            }
          }
        }
      }
    }
  }
}
