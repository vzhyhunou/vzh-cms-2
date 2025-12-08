import { DataSource } from 'typeorm';
import {
  SchemasService,
  DataSourceService,
  StorageService
} from '@vzhyhunou/vzh-cms-common-2';

import { ImportService } from './resources/import.service';
import sourceConfig from './datasource/configuration';

export default async (props) => {
  const dataSource = new DataSource(sourceConfig(props));
  await dataSource.initialize();
  const dataSourceService = new DataSourceService(dataSource);
  const schemasService = new SchemasService(dataSourceService);
  const importService = new ImportService(schemasService);
  await importService.imp();
  const storageService = new StorageService();
  return { schemasService, storageService };
};
