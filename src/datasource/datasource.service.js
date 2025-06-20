import { Dependencies, Injectable } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

@Injectable()
@Dependencies(getDataSourceToken())
export class DataSourceService {
  dataSource;

  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  save(values) {
    this.remove(values);
    const entities = values.map((value) => new EntitySchema(value));
    this.dataSource.options.entities = [
      ...this.dataSource.options.entities,
      ...entities
    ];
  }

  remove(values) {
    const names = values.map(({ name }) => name);
    this.dataSource.options.entities = this.dataSource.options.entities.filter(
      ({ options: { name } }) => !names.includes(name)
    );
  }

  async synchronize() {
    await this.dataSource.buildMetadatas();
    await this.dataSource.synchronize();
  }

  getRepository(resource) {
    const entity = this.dataSource.options.entities.find(
      ({ options: { name } }) => resource === name
    );
    return entity && this.dataSource.getRepository(entity);
  }
}
