import { Test } from '@nestjs/testing';
import {
  TypeOrmModule,
  getEntityManagerToken,
  getDataSourceToken
} from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

import schema from './schema.fixture';
import se from '../../src/schemas/schema.entity.json';
import { DataSourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import '../../src/common/repository/base.repository';

describe('SchemasRepository', () => {
  let manager;
  let subj;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule,
        DataSourceModule,
        TypeOrmModule.forFeature([new EntitySchema(se.value)])
      ]
    }).compile();

    manager = moduleFixture.get(getEntityManagerToken());
    const dataSource = moduleFixture.get(getDataSourceToken());
    subj = dataSource.getRepository(new EntitySchema(se.value));
  });

  it('should be defined', () => {
    expect(subj).toBeDefined();
  });

  describe('save()', () => {
    it('should create a schema', async () => {
      await subj.save(schema('user'));
      const result = await manager.find(new EntitySchema(se.value));
      expect(result).toMatchObject([{ id: 'user' }]);
    });
  });

  describe('delete()', () => {
    it('should delete a schema', async () => {
      await manager.save(new EntitySchema(se.value), schema('user'));
      await subj.remove({ id: 'user' });
      const result = await manager.find(new EntitySchema(se.value));
      expect(result).toHaveLength(0);
    });
  });

  describe('findAll()', () => {
    it('should return an array of schemas', async () => {
      await manager.save(new EntitySchema(se.value), [
        schema('user'),
        schema('page')
      ]);
      let result = await subj.findAll(0, 2);
      expect(result).toMatchObject({
        content: [{ id: 'user' }, { id: 'page' }],
        totalElements: 2
      });
      result = await subj.findAll(1, 2);
      expect(result).toMatchObject({ content: [], totalElements: 2 });
    });

    it('should return an empty array of schemas', async () => {
      await manager.save(new EntitySchema(se.value), schema('user'));
      const options = subj.filter({ id: 'a' });
      const result = await subj.findAll(0, 1, {}, options);
      expect(result).toMatchObject({ content: [], totalElements: 0 });
    });

    it('should return a filtered array of schemas', async () => {
      await manager.save(new EntitySchema(se.value), [
        schema('user'),
        schema('page')
      ]);
      const options = subj.filter({ id: 'uS' });
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
