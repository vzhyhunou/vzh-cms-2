import { Dependencies, Injectable } from '@nestjs/common';

import { ImportService } from './import.service';
import { SchemasService } from '../schemas/schemas.service';

@Injectable()
@Dependencies(SchemasService, ImportService)
export class ImportInitializer {
  constructor(schemasService, importService) {
    this.schemasService = schemasService;
    this.importService = importService;
  }

  async onModuleInit() {
    if (!(await this.schemasService.findSchemaEntities()).length) {
      await this.importService.imp();
    }
  }
}
