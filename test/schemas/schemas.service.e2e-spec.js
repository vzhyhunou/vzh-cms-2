import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { DataSourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import schema from './schema.fixture';
import { Schema } from '../../src/schemas/schema.entity';
import { SchemasModule } from '../../src/schemas/schemas.module';
import { SchemasService } from '../../src/schemas/schemas.service';

describe('SchemasService (e2e)', () => {
  let repository;
  let subj;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ConfigModule, DataSourceModule, SchemasModule]
    }).compile();

    const configService = moduleFixture.get(ConfigService);
    repository = moduleFixture.get(getRepositoryToken(Schema));
    subj = new SchemasService(configService, repository);
  });

  describe('save()', () => {
    it('should save item', async () => {
      await repository.save(schema('user'));
      await subj.initialize();

      let entity = await repository.find();
      expect(entity).toMatchObject([{ id: 'user' }]);

      let itemsRepository = subj.getRepository('user');
      await itemsRepository.save({ id: 'admin' });

      entity = await itemsRepository.find();
      expect(entity).toMatchObject([{ id: 'admin' }]);

      await repository.save(schema('page'));
      await subj.initialize();

      entity = await repository.find();
      expect(entity).toMatchObject([{ id: 'user' }, { id: 'page' }]);

      itemsRepository = subj.getRepository('user');
      entity = await itemsRepository.find();
      //expect(entity).toMatchObject([{ id: 'admin' }]);

      itemsRepository = subj.getRepository('page');
      await itemsRepository.save({ id: 'home' });

      entity = await itemsRepository.find();
      expect(entity).toMatchObject([{ id: 'home' }]);

      await repository.remove({ id: 'user' });
      await subj.initialize();

      entity = await repository.find();
      expect(entity).toMatchObject([{ id: 'page' }]);

      entity = await itemsRepository.find();
      //expect(entity).toMatchObject([{ id: 'home' }]);
    });
  });
});
