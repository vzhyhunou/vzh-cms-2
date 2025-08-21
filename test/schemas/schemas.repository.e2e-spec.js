import { Test } from '@nestjs/testing';
import {
  TypeOrmModule,
  getEntityManagerToken,
  getDataSourceToken
} from '@nestjs/typeorm';
import { EntitySchema, Like } from 'typeorm';

import schema from './schema.fixture';
import { id, entities } from '../../src/schemas/schema.entity.json';
import { DataSourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import customRepository from '../../src/schemas/schemas.repository';

describe('SchemasRepository', () => {
  let manager;
  let subj;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule,
        DataSourceModule,
        TypeOrmModule.forFeature(
          entities.map((e) => new EntitySchema(new Function(`return ${e}`)()))
        )
      ]
    }).compile();

    manager = moduleFixture.get(getEntityManagerToken());
    const dataSource = moduleFixture.get(getDataSourceToken());
    subj = dataSource.getRepository(id).extend(customRepository);
  });

  it('should be defined', () => {
    expect(subj).toBeDefined();
  });

  describe('save()', () => {
    it('should create a schema', async () => {
      await subj.save(schema('user'));
      const result = await manager.find(id);
      expect(result).toMatchObject([{ id: 'user' }]);
    });
  });

  describe('delete()', () => {
    it('should delete a schema', async () => {
      await manager.save(id, schema('user'));
      await subj.remove({ id: 'user' });
      const result = await manager.find(id);
      expect(result).toHaveLength(0);
    });
  });

  describe('findAll()', () => {
    it('should return an array of schemas', async () => {
      await manager.save(id, [schema('user'), schema('page')]);
      let result = await subj.findAndCount({ take: 2 });
      expect(result).toMatchObject([[{ id: 'page' }, { id: 'user' }], 2]);
      result = await subj.findAndCount({ skip: 2 });
      expect(result).toMatchObject([[], 2]);
    });

    it('should return an empty array of schemas', async () => {
      await manager.save(id, schema('user'));
      const result = await subj.findAndCount({ where: { id: Like('%a%') } });
      expect(result).toMatchObject([[], 0]);
    });

    it('should return a filtered array of schemas', async () => {
      await manager.save(id, [schema('user'), schema('page')]);
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
      await manager.save(id, schema('user'));
      const { contents } = await subj.findContent('user', 'contentuser');
      expect(contents).toHaveLength(1);
    });
  });

  describe('findComponent()', () => {
    it('should return a schema with component', async () => {
      await manager.save(id, schema('user'));
      const { components } = await subj.findComponent('user', 'componentuser');
      expect(components).toHaveLength(1);
    });
  });

  describe('findSettings()', () => {
    it('should return a schema with settings', async () => {
      await manager.save(id, schema('user'));
      const result = await subj.findSettings();
      expect(result).toMatchObject([
        {
          id: 'user',
          settings: [
            { name: 'settinguser', value: 'v' },
            { name: 'settinguser2', value: 'v' }
          ]
        }
      ]);
    });
  });

  describe('findResources()', () => {
    it('should return an array of schemas with resources', async () => {
      await manager.save(id, schema('user'));
      const result = await subj.findResources(['editoruser']);
      const { components } = result[0];
      expect(components).toHaveLength(3);
    });
  });

  describe('findEditors()', () => {
    it('should return an array of schemas with editors', async () => {
      await manager.save(id, schema('user'));
      const result = await subj.findEditors();
      const { editor } = result[0];
      expect(editor).toBeDefined();
    });
  });
});
