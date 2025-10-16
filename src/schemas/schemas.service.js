import { Dependencies, Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import merge from 'lodash/merge';

import customRepository from './schemas.repository';
import { DataSourceService } from '../datasource/datasource.service';
import { NotFoundException } from './schemas.exception';
import parse from './parse';
import { transform } from './utils';

const SCHEMA = 'schema';

@Injectable()
@Dependencies(DataSourceService)
export class SchemasService {
  constructor(dataSourceService) {
    this.dataSourceService = dataSourceService;
  }

  async onModuleInit() {
    const rows = await this.findSchemaEntities();
    const items = rows.map(({ entities }) => ({
      entities: new Function(`return ${entities}`)()
    }));
    const entities = this.entities(items);
    await this.dataSourceService.save(entities);
  }

  async findSchemaEntities() {
    try {
      return await this.dataSourceService.dataSource.query(
        'select entities from schema'
      );
    } catch (e) {
      return [];
    }
  }

  async save(resource, item, params) {
    if (resource === SCHEMA) {
      const entities = this.entities(item);
      await this.dataSourceService.save(entities);
    }
    const repository = this.getRepository(resource);
    const transform =
      resource === SCHEMA && item.id === SCHEMA
        ? item.parse
        : await this.findResourceField(resource, 'parse');
    if (transform) {
      item = parse(transform, { ...params, target: item });
    }
    return await repository.save(item);
  }

  async remove(resource, id) {
    const repository = this.getRepository(resource);
    const item = await repository.findById(id);
    if (!item) {
      throw new NotFoundException();
    }
    if (resource === SCHEMA) {
      const entities = this.entities(item);
      await this.dataSourceService.remove(entities);
    }
    return await repository.remove(item);
  }

  async findAll(resource, { page, size, sort, parse: p, ...rest }) {
    const repository = this.getRepository(resource);
    const filter = Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [k, p.includes(k) ? parse(v) : v])
    );
    let [content, totalElements] = await repository.findAndCount({
      where: filter,
      skip: page * size,
      take: size,
      order: sort
    });
    const transform = await this.findResourceField(resource, 'format');
    if (transform) {
      content = content.map((item) => parse(transform, { target: item }));
    }
    return {
      content,
      page: {
        totalElements
      }
    };
  }

  async getIterator(resource) {
    const transform = await this.findResourceField(resource, 'format');
    const repository = this.getRepository(resource);
    let index = 0;
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            let value = await repository.findOne({
              skip: index++,
              take: 1,
              where: {}
            });
            if (value && transform) {
              value = parse(transform, { target: value });
            }
            return { value, done: !value };
          }
        };
      }
    };
  }

  getId(resource, item) {
    const repository = this.getRepository(resource);
    return repository.getId(item);
  }

  async findSchemaIds() {
    const repository = this.getRepository(SCHEMA);
    const schemas = await repository.findField('id');
    return schemas.map(({ id }) => id);
  }

  async findColumns() {
    const repository = this.getRepository(SCHEMA);
    const schemas = await repository.findField('entities');
    return Object.fromEntries(
      schemas.map(({ id, ...rest }) => [
        id,
        Object.keys(this.entities(rest).find(({ name }) => name === id).columns)
      ])
    );
  }

  async findById(resource, id) {
    const repository = this.getRepository(resource);
    let item = await repository.findById(id);
    if (!item) {
      throw new NotFoundException();
    }
    const transform = await this.findResourceField(resource, 'format');
    if (transform) {
      item = parse(transform, { target: item });
    }
    return item;
  }

  async findByIdIn(resource, ids) {
    const repository = this.getRepository(resource);
    let content = await repository.findByIdIn(ids);
    const transform = await this.findResourceField(resource, 'format');
    if (transform) {
      content = content.map((item) => parse(transform, { target: item }));
    }
    return content;
  }

  async findContent(resource, name, params) {
    const repository = this.getRepository(SCHEMA);
    const schema = await repository.findResourceRelation(
      resource,
      'contents',
      name
    );
    if (!schema) {
      throw new NotFoundException();
    }
    const { single, options, projection } = schema.contents[0];
    const itemsRepository = this.getRepository(resource);
    const target = await itemsRepository[single ? 'findOne' : 'find'](
      parse(options, params)
    );
    if (!target) {
      throw new NotFoundException();
    }
    if (!projection) {
      return target;
    }
    return parse(projection, { target });
  }

  async findComponent(resource, name) {
    const repository = this.getRepository(SCHEMA);
    const schema = await repository.findResourceRelation(
      resource,
      'components',
      name
    );
    if (!schema) {
      throw new NotFoundException();
    }
    const { element } = schema.components[0];
    return transform(element);
  }

  async findSettings() {
    const repository = this.getRepository(SCHEMA);
    const schemas = await repository.findField('settings');
    return Object.fromEntries(
      schemas.map(({ id, settings }) => [
        id,
        new Function(`return ${settings}`)()
      ])
    );
  }

  async findResourceField(resource, name) {
    const repository = this.getRepository(SCHEMA);
    const schema = await repository.findResourceField(resource, name);
    return schema?.[name];
  }

  async findResources(authorities) {
    const repository = this.getRepository(SCHEMA);
    const schemas = await repository.findResources(authorities);
    return schemas.map(({ id, components }) => ({
      id,
      ...Object.fromEntries(
        components.map(({ name, element }) => [name, transform(element)])
      )
    }));
  }

  async findMessages() {
    const repository = this.getRepository(SCHEMA);
    const schemas = await repository.findRelation(
      'messages',
      I18nContext.current().lang
    );
    return schemas
      .map(({ messages }) => new Function(`return ${messages[0].value}`)())
      .reduce(merge, {});
  }

  entities(item) {
    const list = Array.isArray(item) ? item : [item];
    return list.flatMap(({ entities }) =>
      entities.map((e) => new Function(`return ${e}`)())
    );
  }

  getRepository(resource) {
    let repository = this.dataSourceService.getRepository(resource);
    if (!repository) {
      throw new NotFoundException();
    }
    if (resource === SCHEMA) {
      repository = repository.extend(customRepository);
    }
    return repository;
  }
}
