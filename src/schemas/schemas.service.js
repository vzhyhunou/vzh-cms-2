import { Dependencies, Injectable } from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { EntitySchema, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Schema } from '../schemas/schema.entity';
import baseRepository from '../common/repository/base.repository';

@Injectable()
@Dependencies(ConfigService, getCustomRepositoryToken(Schema))
export class SchemasService {
  schemas;
  dataSource;

  constructor(configService, repository) {
    this.options = configService.get('datasource');
    this.repository = repository;
    this.initialize();
  }

  async initialize() {
    const entities = await this.repository.find();
    this.schemas = new Map(
      entities.map(({ id, value }) => [id, new EntitySchema(JSON.parse(value))])
    );
    this.dataSource = new DataSource({
      ...this.options,
      synchronize: true,
      entities: [...this.schemas.values()]
    });
    await this.dataSource.initialize();
  }

  getRepository(id) {
    return this.dataSource
      .getRepository(this.schemas.get(id))
      .extend(baseRepository);
  }
}
