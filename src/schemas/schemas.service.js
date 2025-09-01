import { Dependencies, Injectable } from '@nestjs/common';
import { transform } from '@babel/standalone';

import entity from './schema.entity.json';
import customRepository from './schemas.repository';
import { DataSourceService } from '../datasource/datasource.service';
import { NotFoundException } from './schemas.exception';
import { parse } from '../common/repository/base.repository';

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

  findAll(resource, { page, size, sort, parse: p, ...rest }) {
    const repository = this.getRepository(resource);
    const filter = Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [k, p.includes(k) ? parse(v) : v])
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
    const schema = await repository.findContent(resource, name);
    if (!schema) {
      throw new NotFoundException();
    }
    const { single, options, projection } = schema.contents[0];
    const itemsRepository = this.getRepository(resource);
    const result = await itemsRepository[single ? 'findOne' : 'find'](
      parse(options, params)
    );
    if (!result) {
      throw new NotFoundException();
    }
    if (!projection) {
      return result;
    }
    return new Function('target', 'service', `return ${projection}`)(
      result,
      this
    );
  }

  async findComponent(resource, name) {
    const repository = this.getRepository(entity.id);
    const schema = await repository.findComponent(resource, name);
    if (!schema) {
      throw new NotFoundException();
    }
    const { element } = schema.components[0];
    return this.transform(element);
  }

  async findSettings() {
    const repository = this.getRepository(entity.id);
    const schemas = await repository.findSettings();
    return Object.fromEntries(
      schemas.map(({ id, settings }) => [
        id,
        Object.fromEntries(
          settings.map(({ name, value }) => [
            name,
            new Function(`return ${value}`)()
          ])
        )
      ])
    );
  }

  async findResources(authorities) {
    const repository = this.getRepository(entity.id);
    const schemas = await repository.findResources(authorities);
    return schemas.map(({ id, components }) => ({
      id,
      ...Object.fromEntries(
        components.map(({ name, element }) => [name, this.transform(element)])
      )
    }));
  }

  async findEditors() {
    const repository = this.getRepository(entity.id);
    const schemas = await repository.findEditors();
    return Object.fromEntries(schemas.map(({ id, editor }) => [id, editor]));
  }

  entities(list) {
    return list.flatMap(({ entities }) =>
      entities.map((e) => new Function(`return ${e}`)())
    );
  }

  transform(element) {
    return transform(`const result = <>${element}</>`, {
      presets: ['react', 'env']
    }).code;
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
