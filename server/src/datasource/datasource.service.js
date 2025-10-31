import { Dependencies, Injectable } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSourceService as BaseDataSourceService } from '@vzhyhunou/vzh-cms-common-2';

@Injectable()
@Dependencies(getDataSourceToken())
export class DataSourceService extends BaseDataSourceService {
  constructor(dataSource) {
    super(dataSource);
  }
}
