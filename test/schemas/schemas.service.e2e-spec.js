import { Test } from '@nestjs/testing';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
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
    repository = moduleFixture.get(getCustomRepositoryToken(Schema));
    subj = new SchemasService(configService, repository);
  });

  describe('save()', () => {
    it('should save item', async () => {
      let entity = repository.create(schema('user'));
      await subj.save(entity);

      entity = await repository.find();
      expect(entity).toMatchObject([{ id: 'user' }]);

      let usersRepository = subj.getRepository('user');
      entity = usersRepository.create({ id: 'admin' });
      await usersRepository.save(entity);

      usersRepository = subj.getRepository('user');
      entity = await usersRepository.find();
      expect(entity).toMatchObject([{ id: 'admin' }]);

      entity = repository.create(schema('page'));
      await subj.save(entity);

      entity = await repository.find();
      expect(entity).toMatchObject([{ id: 'user' }, { id: 'page' }]);

      usersRepository = subj.getRepository('user');
      entity = await usersRepository.find();
      //expect(entity).toMatchObject([{ id: 'admin' }]);

      let pagesRepository = subj.getRepository('page');
      entity = pagesRepository.create({ id: 'home' });
      await pagesRepository.save(entity);

      pagesRepository = subj.getRepository('page');
      entity = await pagesRepository.find();
      expect(entity).toMatchObject([{ id: 'home' }]);

      await subj.remove('user');

      entity = await repository.find();
      expect(entity).toMatchObject([{ id: 'page' }]);

      pagesRepository = subj.getRepository('page');
      entity = await pagesRepository.find();
      //expect(entity).toMatchObject([{ id: 'home' }]);
    });
  });
});
