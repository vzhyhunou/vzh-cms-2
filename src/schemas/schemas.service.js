import { Dependencies, Injectable } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

import se from './schema.entity.json';
import customRepository from './schemas.repository';

@Injectable()
@Dependencies(getDataSourceToken())
export class SchemasService {
  dataSource;

  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  async onModuleInit() {
    const es = this.find(se.id);
    const repository = this.dataSource.getRepository(es);
    const entities = await repository.find();
    const schemas = entities.map(({ value }) => new EntitySchema(value));
    this.dataSource.options.entities = [
      ...this.dataSource.options.entities,
      ...schemas
    ];
    await repository.save(se);
  }

  find(resource) {
    return this.dataSource.options.entities.find(
      ({ options: { name } }) => resource === name
    );
  }

  async save(dto) {
    const schemas = (Array.isArray(dto) ? dto : [dto]).map(
      ({ value }) => new EntitySchema(value)
    );
    this.dataSource.options.entities = [
      ...this.dataSource.options.entities,
      ...schemas
    ];
    await this.dataSource.buildMetadatas();
    await this.dataSource.synchronize();
  }

  async remove(dto) {
    const ids = (Array.isArray(dto) ? dto : [dto]).map(({ id }) => id);
    this.dataSource.options.entities = this.dataSource.options.entities.filter(
      ({ options: { name } }) => !ids.includes(name)
    );
    await this.dataSource.buildMetadatas();
    await this.dataSource.synchronize();
  }

  getRepository(resource) {
    const es = this.find(resource);
    if (!es) {
      return;
    }
    let repository = this.dataSource.getRepository(es);
    if (resource === se.id) {
      repository = repository.extend(customRepository(this));
    }
    return repository;
  }

  getResources() {
    return this.dataSource.options.entities.map(
      ({ options: { name } }) => name
    );
  }
}
