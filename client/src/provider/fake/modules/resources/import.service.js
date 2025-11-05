import { AbstractImportService } from '@vzhyhunou/vzh-cms-common-2';

import data from './data';

const RESOURCES = 'resources';
const STATIC = 'static';

export class ImportService extends AbstractImportService {
  constructor(schemasService) {
    super(schemasService, console);
  }

  async consume(filter, transformer, method) {
    for (const [folder, resources] of Object.entries(data)) {
      switch (folder) {
        case RESOURCES: {
          for (const [resource, items] of Object.entries(resources)) {
            for (const [name, item] of Object.entries(items)) {
              if (filter(resource, name)) {
                const transformed = await transformer(item, resource);
                await this.schemasService[method](resource, transformed);
              }
            }
          }
          break;
        }
        case STATIC: {
          if (filter()) {
            for (const item of resources) {
              await this.schemasService.create(STATIC, item);
            }
          }
          break;
        }
        default: {
        }
      }
    }
  }
}
