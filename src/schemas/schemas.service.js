import { Dependencies, Injectable } from '@nestjs/common';

import entity from './schema.entity.json';
import customRepository from './schemas.repository';
import { DataSourceService } from '../datasource/datasource.service';

@Injectable()
@Dependencies(DataSourceService)
export class SchemasService {
  service;

  constructor(service) {
    this.service = service;
  }

  async onModuleInit() {
    const repository = this.service.getRepository(entity.id);
    await repository.save(entity);
    const list = await repository.find();
    const values = this.parse(list);
    this.service.save(values);
  }

  async save(dto) {
    const list = Array.isArray(dto) ? dto : [dto];
    const values = this.parse(list);
    this.service.save(values);
    await this.service.synchronize();
  }

  async remove(dto) {
    const list = Array.isArray(dto) ? dto : [dto];
    const values = this.parse(list);
    this.service.remove(values);
    await this.service.synchronize();
  }

  parse(values) {
    return values.flatMap(({ entities }) =>
      entities.map((e) => new Function(`return ${e}`)())
    );
  }

  getRepository(resource) {
    let repository = this.service.getRepository(resource);
    if (!repository) {
      return;
    }
    if (resource === entity.id) {
      repository = repository.extend(customRepository(this));
    }
    return repository;
  }
}
