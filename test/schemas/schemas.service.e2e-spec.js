import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

import { DataSourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import schema from './schema.fixture';
import se from '../../src/schemas/schema.entity.json';
import { SchemasService } from '../../src/schemas/schemas.service';
import { DataSourceService } from '../../src/datasource/datasource.service';

describe('SchemasService (e2e)', () => {
  let subj;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule,
        DataSourceModule,
        TypeOrmModule.forFeature([new EntitySchema(se.value)])
      ]
    }).compile();

    const service = moduleFixture.get(DataSourceService);
    subj = new SchemasService(service);
  });

  it('should be defined', () => {
    expect(subj).toBeDefined();
  });

  describe('save()', () => {
    it('should save item', async () => {
      const repository = subj.getRepository(se.id);
      entities = await repository.find();
      expect(entities).toHaveLength(0);

      await repository.save(schema('user'));
      let entities = await repository.find();
      expect(entities).toMatchObject([{ id: 'user' }]);

      let itemsRepository = subj.getRepository('user');
      await itemsRepository.save({ id: 'admin' });
      entities = await itemsRepository.find();
      expect(entities).toMatchObject([{ id: 'admin' }]);

      await repository.save(schema('page'));
      entities = await repository.find();
      expect(entities).toMatchObject([{ id: 'user' }, { id: 'page' }]);

      itemsRepository = subj.getRepository('user');
      entities = await itemsRepository.find();
      expect(entities).toMatchObject([{ id: 'admin' }]);

      itemsRepository = subj.getRepository('page');
      await itemsRepository.save({ id: 'home' });
      entities = await itemsRepository.find();
      expect(entities).toMatchObject([{ id: 'home' }]);

      await repository.remove(schema('user'));
      entities = await repository.find();
      expect(entities).toMatchObject([{ id: 'page' }]);

      itemsRepository = subj.getRepository('page');
      entities = await itemsRepository.find();
      expect(entities).toMatchObject([{ id: 'home' }]);
    });
  });
});
