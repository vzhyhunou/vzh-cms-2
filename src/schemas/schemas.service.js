import { Dependencies, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntitySchema, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Schema } from '../schemas/schema.entity';

const SCHEMA = 'schema';

@Injectable()
@Dependencies(ConfigService, getRepositoryToken(Schema))
export class SchemasService {
  schemas;
  dataSource;

  constructor(configService, repository) {
    this.options = configService.get('datasource');
    this.repository = repository;
    this.initialize(this.options.synchronize);
  }

  async initialize(synchronize = true) {
    const entities = await this.repository.find();
    this.schemas = new Map(
      entities.map(({ id, value }) => [id, new EntitySchema(value)])
    );
    this.dataSource = new DataSource({
      ...this.options,
      synchronize,
      entities: [...this.schemas.values()]
    });
    await this.dataSource.initialize();
  }

  getRepository(resource) {
    if (resource === SCHEMA) {
      return this.repository;
    }
    const schema = this.schemas.get(resource);
    return schema && this.dataSource.getRepository(schema);
  }

  async update(resource) {
    resource === SCHEMA && (await this.initialize());
  }
}
