import { Test } from '@nestjs/testing';
import {
  TypeOrmModule,
  getEntityManagerToken,
  getDataSourceToken
} from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

import schema from './schema.fixture';
import { id, entities } from '../../src/schemas/schema.entity.json';
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
        TypeOrmModule.forFeature(
          entities.map((e) => new EntitySchema(new Function(`return ${e}`)()))
        )
      ]
    }).compile();

    manager = moduleFixture.get(getEntityManagerToken());
    const dataSource = moduleFixture.get(getDataSourceToken());
    subj = dataSource.getRepository(id);
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
      expect(result).toMatchObject([[{ id: 'user' }, { id: 'page' }], 2]);
      result = await subj.findAndCount({ skip: 2 });
      expect(result).toMatchObject([[], 2]);
    });

    it('should return an empty array of schemas', async () => {
      await manager.save(id, schema('user'));
      const filter = { id: subj.options(`Like('%a%')`) };
      const result = await subj.findAndCount({ where: filter });
      expect(result).toMatchObject([[], 0]);
    });

    it('should return a filtered array of schemas', async () => {
      await manager.save(id, [schema('user'), schema('page')]);
      const filter = { id: subj.options(`Like('%uS%')`) };
      let result = await subj.findAndCount({ where: filter, take: 1 });
      expect(result).toMatchObject([[{ id: 'user' }], 1]);
      result = await subj.findAndCount({ where: filter, skip: 1 });
      expect(result).toMatchObject([[], 1]);
    });
  });
});
