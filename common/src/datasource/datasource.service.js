import { EntitySchema } from 'typeorm';

export class DataSourceService {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  async save(values) {
    this.saveSchema(values);
    await this.synchronize();
  }

  saveSchema(values) {
    this.removeSchema(values);
    this.dataSource.options.entities = [
      ...this.dataSource.options.entities,
      ...values.map((entity) => new EntitySchema(entity))
    ];
  }

  async remove(values) {
    this.removeSchema(values);
    await this.synchronize();
  }

  removeSchema(values) {
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
