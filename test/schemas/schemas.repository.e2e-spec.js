import { Test } from '@nestjs/testing';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { Like } from 'typeorm';

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
    subj = moduleFixture.get(getRepositoryToken(Schema));
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
      let result = await subj.findAll(0, 2);
      expect(result).toMatchObject({
        content: [{ id: 'user' }, { id: 'page' }],
        totalElements: 2
      });
      result = await subj.findAll(1, 2);
      expect(result).toMatchObject({ content: [], totalElements: 2 });
    });

    it('should return an empty array of schemas', async () => {
      const entity = manager.create(Schema, schema('user'));
      await manager.save(entity);
      const options = { where: { id: Like('%a%') } };
      const result = await subj.findAll(0, 1, {}, options);
      expect(result).toMatchObject({ content: [], totalElements: 0 });
    });

    it('should return a filtered array of schemas', async () => {
      const entities = manager.create(Schema, [schema('user'), schema('page')]);
      await manager.save(entities);
      const options = { where: { id: Like('%uS%') } };
      let result = await subj.findAll(0, 1, {}, options);
      expect(result).toMatchObject({
        content: [{ id: 'user' }],
        totalElements: 1
      });
      result = await subj.findAll(1, 1, {}, options);
      expect(result).toMatchObject({ content: [], totalElements: 1 });
    });
  });
});
