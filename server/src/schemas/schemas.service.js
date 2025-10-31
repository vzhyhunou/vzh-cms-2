import { Dependencies, Injectable } from '@nestjs/common';
import { SchemasService as BaseSchemasService } from '@vzhyhunou/vzh-cms-common-2';

import { DataSourceService } from '../datasource/datasource.service';

@Injectable()
@Dependencies(DataSourceService)
export class SchemasService extends BaseSchemasService {
  constructor(dataSourceService) {
    super(dataSourceService);
  }

  async onModuleInit() {
    const rows = await this.findSchemaEntities();
    const items = rows.map(({ entities }) => ({
      entities: new Function(`return ${entities}`)()
    }));
    const entities = this.entities(items);
    await this.dataSourceService.save(entities);
  }

  async findSchemaEntities() {
    try {
      return await this.dataSourceService.dataSource.query(
        'select entities from schema'
      );
    } catch (e) {
      return [];
    }
  }
}
