import { Dependencies, Injectable } from '@nestjs/common';

import entity from './schema.entity.json';
import customRepository from './schemas.repository';
import { DataSourceService } from '../datasource/datasource.service';

@Injectable()
@Dependencies(DataSourceService)
export class SchemasService {
  constructor(service) {
    this.service = service;
  }

  async onModuleInit() {
    const repository = this.service.getRepository(entity.id);
    await repository.save(entity);
    const list = await repository.find();
    const entities = this.entities(list);
    this.service.save(entities);
  }

  async save(dto) {
    const list = Array.isArray(dto) ? dto : [dto];
    const entities = this.entities(list);
    this.service.save(entities);
    await this.service.synchronize();
    for (const { name, rows } of this.data(list)) {
      const repository = this.service.getRepository(name);
      await repository.save(rows);
      const ids = rows.map((row) => repository.getId(row));
      await repository.removeByIdNotIn(ids);
    }
  }

  async remove(dto) {
    const list = Array.isArray(dto) ? dto : [dto];
    const entities = this.entities(list);
    this.service.remove(entities);
    await this.service.synchronize();
  }

  entities(list) {
    return list.flatMap(({ entities }) =>
      entities.map((e) => new Function(`return ${e}`)())
    );
  }

  data(list) {
    return list.flatMap(({ data }) =>
      data.map((e) => new Function(`return ${e}`)())
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
