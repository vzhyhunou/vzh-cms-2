import { Test } from '@nestjs/testing';

import { DataSourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import schema from './schema.fixture';
import entity from './entity.fixture';
import { SchemasService } from '../../src/schemas/schemas.service';
import { DataSourceService } from '../../src/datasource/datasource.service';

const SCHEMA = 'schema';

describe('SchemasService (e2e)', () => {
  let subj;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ConfigModule, DataSourceModule]
    }).compile();

    const dataSourceService = moduleFixture.get(DataSourceService);

    await dataSourceService.save(
      entity.entities.map((e) => new Function(`return ${e}`)())
    );
    subj = new SchemasService(dataSourceService);
  });

  it('should be defined', () => {
    expect(subj).toBeDefined();
  });

  describe('save()', () => {
    it('should save item', async () => {
      const repository = subj.getRepository(SCHEMA);

      let entities = await repository.find();
      expect(entities).toHaveLength(0);

      await subj.save(SCHEMA, schema('user'));
      entities = await repository.find();
      expect(entities).toMatchObject([{ id: 'user' }]);

      const usersRepository = subj.getRepository('user');

      await subj.save('user', { id: 'admin' });
      entities = await usersRepository.find();
      expect(entities).toMatchObject([{ id: 'admin' }]);

      await subj.save(SCHEMA, schema('page'));
      entities = await repository.find();
      expect(entities).toMatchObject([{ id: 'user' }, { id: 'page' }]);

      const pagesRepository = subj.getRepository('page');

      await subj.save('page', { id: 'home' });
      entities = await pagesRepository.find();
      expect(entities).toMatchObject([{ id: 'home' }]);
    });
  });
});
