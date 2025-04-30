import { Test } from '@nestjs/testing';
import {
  getEntityManagerToken,
  getCustomRepositoryToken
} from '@nestjs/typeorm';

import { Schema } from '../../src/schemas/schema.entity';
import schema from './schema.fixture';
import { DataSourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import { SchemasModule } from '../../src/schemas/schemas.module';

describe('SchemasRepository', () => {
  let manager;
  let subj;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ConfigModule, DataSourceModule, SchemasModule]
    }).compile();

    manager = moduleFixture.get(getEntityManagerToken());
    subj = moduleFixture.get(getCustomRepositoryToken(Schema));
  });

  it('should be defined', () => {
    expect(subj).toBeDefined();
  });

  describe('save()', () => {
    it('should create a schema', async () => {
      const entity = manager.create(Schema, schema('user'));
      await subj.save(entity);
      const result = await manager.find(Schema);
      expect(result).toMatchObject([{ id: 'user' }]);
    });
  });

  describe('delete()', () => {
    it('should delete a schema', async () => {
      const entity = manager.create(Schema, schema('user'));
      await manager.save(entity);
      await subj.remove(entity);
      const result = await manager.find(Schema);
      expect(result).toHaveLength(0);
    });
  });

  describe('findAll()', () => {
    it('should return an array of schemas', async () => {
      const entities = manager.create(Schema, [schema('user'), schema('page')]);
      await manager.save(entities);
      let result = await subj.findAll({ page: 0, size: 2 });
      expect(result).toMatchObject({
        content: [{ id: 'user' }, { id: 'page' }],
        totalElements: 2
      });
      result = await subj.findAll({ page: 1, size: 2 });
      expect(result).toMatchObject({ content: [], totalElements: 2 });
    });
  });

  describe('list()', () => {
    it('should return an empty array of schemas', async () => {
      const entity = manager.create(Schema, schema('user'));
      await manager.save(entity);
      const result = await subj.list({ id: 'a' }, { page: 0, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 0 });
    });

    it('should return a filtered array of schemas', async () => {
      const entities = manager.create(Schema, [schema('user'), schema('page')]);
      await manager.save(entities);
      let result = await subj.list({ id: 'uS' }, { page: 0, size: 1 });
      expect(result).toMatchObject({
        content: [{ id: 'user' }],
        totalElements: 1
      });
      result = await subj.list({ id: 'uS' }, { page: 1, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 1 });
    });
  });
});
