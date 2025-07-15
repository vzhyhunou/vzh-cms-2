import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

import { DataSourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import schema from './schema.fixture';
import { id, entities } from '../../src/schemas/schema.entity.json';
import { SchemasService } from '../../src/schemas/schemas.service';
import { DataSourceService } from '../../src/datasource/datasource.service';

describe('SchemasService (e2e)', () => {
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

    const dataSourceService = moduleFixture.get(DataSourceService);
    const storageService = { replaceFilenames: (dto) => dto };
    subj = new SchemasService(dataSourceService, storageService);
  });

  it('should be defined', () => {
    expect(subj).toBeDefined();
  });

  describe('save()', () => {
    it('should save item', async () => {
      const repository = subj.getRepository(id);
      entities = await repository.find();
      expect(entities).toHaveLength(0);

      await subj.save(id, schema('user'));
      let entities = await repository.find();
      expect(entities).toMatchObject([{ id: 'user' }]);

      const usersRepository = subj.getRepository('user');

      await subj.save('user', { id: 'admin' });
      entities = await usersRepository.find();
      expect(entities).toMatchObject([{ id: 'admin' }]);

      await subj.save('schema', schema('page'));
      entities = await repository.find();
      expect(entities).toMatchObject([{ id: 'user' }, { id: 'page' }]);

      const pagesRepository = subj.getRepository('page');

      await subj.save('page', { id: 'home' });
      entities = await pagesRepository.find();
      expect(entities).toMatchObject([{ id: 'home' }]);

      await repository.remove(schema('user'));
      entities = await repository.find();
      expect(entities).toMatchObject([{ id: 'page' }]);

      entities = await pagesRepository.find();
      expect(entities).toMatchObject([{ id: 'home' }]);
    });
  });
});
