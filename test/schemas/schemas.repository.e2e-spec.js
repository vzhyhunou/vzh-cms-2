import { Test } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { Like } from 'typeorm';

import schema from './schema.fixture';
import entity from './entity.fixture';
import { DataSourceModule } from '../../src/datasource/datasource.module';
import { DataSourceService } from '../../src/datasource/datasource.service';
import { ConfigModule } from '../../src/config/config.module';
import customRepository from '../../src/schemas/schemas.repository';

const SCHEMA = 'schema';

describe('SchemasRepository', () => {
  let manager;
  let subj;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ConfigModule, DataSourceModule]
    }).compile();

    manager = moduleFixture.get(getEntityManagerToken());
    const dataSourceService = moduleFixture.get(DataSourceService);

    await dataSourceService.save(
      entity.entities.map((e) => new Function(`return ${e}`)())
    );
    subj = dataSourceService.getRepository(SCHEMA).extend(customRepository);
  });

  it('should be defined', () => {
    expect(subj).toBeDefined();
  });

  describe('save()', () => {
    it('should create a schema', async () => {
      await subj.save(schema('user'));
      const result = await manager.find(SCHEMA);
      expect(result).toMatchObject([{ id: 'user' }]);
    });
  });

  describe('delete()', () => {
    it('should delete a schema', async () => {
      await manager.save(SCHEMA, schema('user'));
      await subj.remove({ id: 'user' });
      const result = await manager.find(SCHEMA);
      expect(result).toHaveLength(0);
    });
  });

  describe('findAll()', () => {
    it('should return an array of schemas', async () => {
      await manager.save(SCHEMA, [schema('user'), schema('page')]);
      let result = await subj.findAndCount({ take: 2 });
      expect(result).toMatchObject([[{ id: 'page' }, { id: 'user' }], 2]);
      result = await subj.findAndCount({ skip: 2 });
      expect(result).toMatchObject([[], 2]);
    });

    it('should return an empty array of schemas', async () => {
      await manager.save(SCHEMA, schema('user'));
      const result = await subj.findAndCount({ where: { id: Like('%a%') } });
      expect(result).toMatchObject([[], 0]);
    });

    it('should return a filtered array of schemas', async () => {
      await manager.save(SCHEMA, [schema('user'), schema('page')]);
      let result = await subj.findAndCount({
        where: { id: Like('%uS%') },
        take: 1
      });
      expect(result).toMatchObject([[{ id: 'user' }], 1]);
      result = await subj.findAndCount({
        where: { id: Like('%uS%') },
        skip: 1
      });
      expect(result).toMatchObject([[], 1]);
    });
  });

  describe('findContent()', () => {
    it('should return a schema with content', async () => {
      await manager.save(SCHEMA, schema('user'));
      const { contents } = await subj.findContent('user', 'contentuser');
      expect(contents).toHaveLength(1);
    });
  });

  describe('findComponent()', () => {
    it('should return a schema with component', async () => {
      await manager.save(SCHEMA, schema('user'));
      const { components } = await subj.findComponent('user', 'Componentuser');
      expect(components).toHaveLength(1);
    });
  });

  describe('findSettings()', () => {
    it('should return a schema with settings', async () => {
      await manager.save(SCHEMA, schema('user'));
      const settings = await subj.findSettings();
      expect(settings).toHaveLength(1);
    });
  });

  describe('findEvent()', () => {
    it('should return a schema with event', async () => {
      await manager.save(SCHEMA, schema('user'));
      const { events } = await subj.findEvent('user', 'eventuser');
      expect(events).toHaveLength(1);
    });
  });

  describe('findResources()', () => {
    it('should return an array of schemas with resources', async () => {
      await manager.save(SCHEMA, schema('user'));
      const result = await subj.findResources(['editoruser']);
      const { components } = result[0];
      expect(components).toHaveLength(3);
    });
  });

  describe('findEditors()', () => {
    it('should return an array of schemas with editors', async () => {
      await manager.save(SCHEMA, schema('user'));
      const result = await subj.findEditors();
      const { editor } = result[0];
      expect(editor).toBeDefined();
    });
  });
});
