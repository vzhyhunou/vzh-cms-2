import { Dependencies, Injectable } from '@nestjs/common';

import entity from './schema.entity.json';
import customRepository from './schemas.repository';
import { DataSourceService } from '../datasource/datasource.service';
import { NotFoundException } from './schemas.exception';

@Injectable()
@Dependencies(DataSourceService)
export class SchemasService {
  constructor(dataSourceService) {
    this.dataSourceService = dataSourceService;
  }

  async onModuleInit() {
    const repository = this.getRepository(entity.id);
    await repository.save(entity);
    const list = await repository.find();
    const entities = this.entities(list);
    this.dataSourceService.save(entities);
  }

  async save(resource, dto) {
    const repository = this.getRepository(resource);
    if (resource === entity.id) {
      const list = Array.isArray(dto) ? dto : [dto];
      const entities = this.entities(list);
      this.dataSourceService.save(entities);
      await this.dataSourceService.synchronize();
    }
    return await repository.save(dto);
  }

  async remove(resource, id) {
    const repository = this.getRepository(resource);
    const item = await repository.findById(id);
    if (!item) {
      throw new NotFoundException();
    }
    if (resource === entity.id) {
      const list = Array.isArray(item) ? item : [item];
      const entities = this.entities(list);
      this.dataSourceService.remove(entities);
      await this.dataSourceService.synchronize();
    }
    return await repository.remove(item);
  }

  findAll(resource, { page, size, sort, transform, ...rest }) {
    const repository = this.getRepository(resource);
    const filter = Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [
        k,
        transform.includes(k) ? repository.options(v) : v
      ])
    );
    return repository
      .findAndCount({
        where: filter,
        skip: page * size,
        take: size,
        order: sort
      })
      .then(([content, totalElements]) => ({
        content,
        page: {
          totalElements
        }
      }));
  }

  async findById(resource, id) {
    const repository = this.getRepository(resource);
    const item = await repository.findById(id);
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }

  findByIdIn(resource, ids) {
    const repository = this.getRepository(resource);
    return repository.findByIdIn(ids);
  }

  async findContent(resource, name, params) {
    const repository = this.getRepository(entity.id);
    const schema = await repository.findByContent(resource, name);
    if (!schema) {
      throw new NotFoundException();
    }
    const { findOne, findOptions } = schema.contents[0];
    const itemsRepository = this.getRepository(resource);
    return await itemsRepository[findOne ? 'findOne' : 'find'](
      repository.options(findOptions, { params })
    );
  }

  async findComponent(resource, name) {
    const repository = this.getRepository(entity.id);
    const schema = await repository.findByComponent(resource, name);
    if (!schema) {
      throw new NotFoundException();
    }
    const { element } = schema.components[0];
    return element;
  }

  async findConfig(resource, name) {
    const repository = this.getRepository(entity.id);
    const schema = await repository.findByConfig(resource, name);
    if (!schema) {
      throw new NotFoundException();
    }
    const { value } = schema.config[0];
    return new Function(`return ${value}`)();
  }

  async getResources() {
    const repository = this.getRepository(entity.id);
    const schemas = await repository.getResources();
    return schemas.map(({ id, components }) => ({
      id,
      ...Object.fromEntries(
        components.map(({ name, element }) => [name, element])
      )
    }));
  }

  entities(list) {
    return list.flatMap(({ entities }) =>
      entities.map((e) => new Function(`return ${e}`)())
    );
  }

  getRepository(resource) {
    let repository = this.dataSourceService.getRepository(resource);
    if (!repository) {
      throw new NotFoundException();
    }
    if (resource === entity.id) {
      repository = repository.extend(customRepository);
    }
    return repository;
  }
}
