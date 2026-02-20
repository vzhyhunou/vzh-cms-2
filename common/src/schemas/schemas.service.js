import merge from 'lodash/merge';
import DOMPurify from 'dompurify';

import SchemasRepository from './schemas.repository';
import { NotFoundException, ConflictException } from './schemas.exception';
import parse from './parse';
import { transform } from './utils';

const SCHEMA = 'schema';

export class SchemasService {
  constructor(dataSourceService, window) {
    this.dataSourceService = dataSourceService;
    this.window = window;
  }

  async save(resource, item, params) {
    if (resource === SCHEMA) {
      const entities = this.entities(item);
      await this.dataSourceService.save(entities);
    }
    const transform =
      resource === SCHEMA && item.id === SCHEMA
        ? item.parse
        : await this.findResourceField(resource, 'parse');
    if (transform) {
      item = await this.parse(transform, { ...params, target: item });
    }
    const repository = this.getRepository(resource);
    const result = await repository.save(item);
    if (resource === SCHEMA) {
      this.settings = undefined;
    }
    return result;
  }

  async verifyEntities(item) {
    const others = Object.entries(await this.findEntities())
      .filter(([key]) => key !== item.id)
      // eslint-disable-next-line no-unused-vars
      .flatMap(([key, value]) => value);
    const current = this.entities(item).map(({ name }) => name);
    if (current.some((name) => others.includes(name))) {
      throw new ConflictException();
    }
  }

  async create(resource, item, params) {
    const repository = this.getRepository(resource);
    const id = repository.getId(item);
    if (id) {
      const databaseItem = await repository.findById(id);
      if (databaseItem) {
        throw new ConflictException();
      }
    }
    if (resource === SCHEMA) {
      await this.verifyEntities(item);
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
      await this.verifyEntities(item);
      const entities = this.entities(databaseItem);
      await this.dataSourceService.remove(entities);
    }
    return await this.save(resource, item, params);
  }

  async removeById(resource, id) {
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

  async removeByIdIn(resource, ids) {
    const repository = this.getRepository(resource);
    const items = await repository.findByIdIn(ids);
    if (ids.length > items.length) {
      throw new NotFoundException();
    }
    if (resource === SCHEMA) {
      const entities = this.entities(items);
      await this.dataSourceService.remove(entities);
    }
    return await repository.remove(items);
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
        content.map(
          async (item) => await this.parse(transform, { target: item })
        )
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
    const self = this;
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
              value = await self.parse(transform, { target: value });
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

  async findEntities() {
    const repository = this.getRepository(SCHEMA);
    const schemas = await repository.findField('entities');
    return Object.fromEntries(
      schemas.map(({ id, ...rest }) => [
        id,
        this.entities(rest).map(({ name }) => name)
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
      item = await this.parse(transform, { target: item });
    }
    return item;
  }

  async findByIdIn(resource, ids) {
    const repository = this.getRepository(resource);
    let content = await repository.findByIdIn(ids);
    const transform = await this.findResourceField(resource, 'format');
    if (transform) {
      content = await Promise.all(
        content.map(
          async (item) => await this.parse(transform, { target: item })
        )
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
    if (!options) {
      return this.parse(projection, { ...params });
    }
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

  async findClientSettings() {
    const repository = this.getRepository(SCHEMA);
    const schemas = await repository.findField('clientSettings');
    return Object.fromEntries(
      schemas.map(({ id, clientSettings }) => [
        id,
        new Function(`return ${clientSettings}`)()
      ])
    );
  }

  async findSettings() {
    if (!this.settings) {
      const repository = this.getRepository(SCHEMA);
      const schemas = await repository.findField(
        'clientSettings',
        'serverSettings'
      );
      this.settings = Object.fromEntries(
        schemas.map(({ id, clientSettings, serverSettings }) => [
          id,
          merge(
            new Function(`return ${clientSettings}`)(),
            new Function(`return ${serverSettings}`)()
          )
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
    const sanitize = (...args) => this.sanitize(...args);
    return parse(code, { settings, content, sanitize, ...bindings });
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

  sanitize(code, { ADD_TAGS = [], ...rest } = {}) {
    const sanitized = DOMPurify(this.window).sanitize(`<root>${code}</root>`, {
      ...rest,
      ADD_TAGS: ['root', ...ADD_TAGS]
    });
    return sanitized.match(/<[^>]*>([\s|\S]*)</)[1];
  }
}
