import { Test } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { Like } from 'typeorm';
import { SchemasRepository } from '@vzhyhunou/vzh-cms-common-2';

import schema from './schema.fixture';
import entity from './entity.fixture';
import { DataSourceModule } from '../../src/datasource/datasource.module';
import { DataSourceService } from '../../src/datasource/datasource.service';
import { ConfigModule } from '../../src/config/config.module';

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
    subj = dataSourceService.getRepository(SCHEMA).extend(SchemasRepository);
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

  describe('findField()', () => {
    it('should return an array of schemas with field values', async () => {
      await manager.save(SCHEMA, schema('user'));
      const result = await subj.findField('clientSettings');
      expect(result).toHaveLength(1);
    });
  });

  describe('findResourceField()', () => {
    it('should return a schema with field value', async () => {
      await manager.save(SCHEMA, schema('user'));
      const { parse } = await subj.findResourceField('user', 'parse');
      expect(parse).toBeDefined();
    });
  });

  describe('findRelation()', () => {
    it('should return an array of schemas with relation', async () => {
      await manager.save(SCHEMA, schema('user'));
      const result = await subj.findRelation('contents', 'content');
      expect(result).toHaveLength(1);
    });
  });

  describe('findResourceRelation()', () => {
    it('should return a schema with relation field value', async () => {
      await manager.save(SCHEMA, schema('user'));
      const { contents } = await subj.findResourceRelation(
        'user',
        'contents',
        'content'
      );
      expect(contents).toHaveLength(1);
    });
  });

  describe('findResources()', () => {
    it('should return an array of schemas with resources', async () => {
      await manager.save(SCHEMA, schema('user'));
      const result = await subj.findResources(['editor']);
      expect(result).toHaveLength(1);
    });
  });
});
