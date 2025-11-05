import merge from 'lodash/merge';

import SchemasRepository from './schemas.repository';
import { NotFoundException, ConflictException } from './schemas.exception';
import parse from './parse';
import { transform } from './utils';

const SCHEMA = 'schema';

export class SchemasService {
  constructor(dataSourceService) {
    this.dataSourceService = dataSourceService;
  }

  async save(resource, item, params) {
    if (resource === SCHEMA) {
      const entities = this.entities(item);
      await this.dataSourceService.save(entities);
      this.settings = undefined;
    }
    const transform =
      resource === SCHEMA && item.id === SCHEMA
        ? item.parse
        : await this.findResourceField(resource, 'parse');
    if (transform) {
      item = await parse(transform, { ...params, target: item });
    }
    const repository = this.getRepository(resource);
    return await repository.save(item);
  }

  async create(resource, item, params) {
    const repository = this.getRepository(resource);
    const id = repository.getId(item);
    const databaseItem = await repository.findById(id);
    if (databaseItem) {
      throw new ConflictException();
    }
    return await this.save(resource, item, params);
  }

  async update(resource, item, params) {
    const repository = this.getRepository(resource);
    const id = repository.getId(item);
    const databaseItem = await repository.findById(id);
    if (!databaseItem) {
      throw new NotFoundException();
    }
    if (resource === SCHEMA) {
      const entities = this.entities(databaseItem);
      await this.dataSourceService.remove(entities);
    }
    return await this.save(resource, item, params);
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
      await Promise.all(
        Object.entries(rest).map(async ([k, v]) => [
          k,
          p.includes(k) ? await parse(v) : v
        ])
      )
    );
    let [content, totalElements] = await repository.findAndCount({
      where: filter,
      skip: page * size,
      take: size,
      order: sort
    });
    const transform = await this.findResourceField(resource, 'format');
    if (transform) {
      content = await Promise.all(
        content.map(async (item) => await parse(transform, { target: item }))
      );
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
              value = await parse(transform, { target: value });
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
      item = await parse(transform, { target: item });
    }
    return item;
  }

  async findByIdIn(resource, ids) {
    const repository = this.getRepository(resource);
    let content = await repository.findByIdIn(ids);
    const transform = await this.findResourceField(resource, 'format');
    if (transform) {
      content = await Promise.all(
        content.map(async (item) => await parse(transform, { target: item }))
      );
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
      await this.parse(options, params)
    );
    if (!target) {
      throw new NotFoundException();
    }
    if (!projection) {
      return target;
    }
    return this.parse(projection, { ...params, target });
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
    if (!this.settings) {
      const repository = this.getRepository(SCHEMA);
      const schemas = await repository.findField('settings');
      this.settings = Object.fromEntries(
        schemas.map(({ id, settings }) => [
          id,
          new Function(`return ${settings}`)()
        ])
      );
    }
    return this.settings;
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

  async findMessages(locale) {
    const repository = this.getRepository(SCHEMA);
    const schemas = await repository.findRelation('messages', locale);
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

  async parse(code, bindings) {
    const settings = await this.findSettings();
    const content = (...args) => this.findContent(...args);
    return parse(code, { settings, content, ...bindings });
  }

  getRepository(resource) {
    let repository = this.dataSourceService.getRepository(resource);
    if (!repository) {
      throw new NotFoundException();
    }
    if (resource === SCHEMA) {
      repository = repository.extend(SchemasRepository);
    }
    return repository;
  }
}
