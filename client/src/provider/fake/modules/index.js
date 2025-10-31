import { DataSource } from 'typeorm';
import { SchemasService, DataSourceService } from '@vzhyhunou/vzh-cms-common-2';

import { ImportService } from './resources/import.service';
import sourceConfig from './datasource/configuration';

export default async () => {
  const dataSource = new DataSource(sourceConfig);
  await dataSource.initialize();
  const dataSourceService = new DataSourceService(dataSource);
  const schemasService = new SchemasService(dataSourceService);
  const importService = new ImportService(schemasService);
  await importService.imp();
  return { schemasService };
};
