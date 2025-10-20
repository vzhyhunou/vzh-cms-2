import { Test } from '@nestjs/testing';
import request from 'supertest';

import schema from './schema.fixture';
import entity from './entity.fixture';
import { ConfigModule } from '../../src/config/config.module';
import { SchemasModule } from '../../src/schemas/schemas.module';
import { SchemasService } from '../../src/schemas/schemas.service';

const SCHEMA = 'schema';

describe('Schemas (e2e)', () => {
  let repository;
  let app;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ConfigModule, SchemasModule]
    }).compile();

    const service = moduleFixture.get(SchemasService);
    app = moduleFixture.createNestApplication();

    await app.init();

    await service.save(SCHEMA, entity);
    repository = service.getRepository(SCHEMA);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('/resource/schema (GET)', () => {
    it('should return a page of schemas', async () => {
      await repository.save([schema('page'), schema('user')]);
      await request(app.getHttpServer())
        .get(
          '/api/resource/schema?id=Like%28%27%25g%25%27%29&parse=id&page=0&size=1&sort=id%2CASC'
        )
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            content: [{ id: 'page' }],
            page: { totalElements: 1 }
          });
        });
      await request(app.getHttpServer())
        .get(
          '/api/resource/schema?id=Like%28%27%25g%25%27%29&parse=id&page=1&size=1&sort=id%2CASC'
        )
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            content: [],
            page: { totalElements: 1 }
          });
        });
    });

    it('should return an array of schemas', async () => {
      await repository.save([schema('page'), schema('user')]);
      await request(app.getHttpServer())
        .get('/api/resource/schema?ids=page&ids=user')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject([{ id: 'page' }, { id: 'user' }]);
        });
    });
  });

  it('/resource/schema/:id (GET)', async () => {
    await repository.save([schema('page'), schema('user')]);
    await request(app.getHttpServer())
      .get('/api/resource/schema/page')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({ id: 'page' });
      });
  });

  it('/resource/schema (POST)', async () => {
    await repository.save(schema('user'));
    await request(app.getHttpServer())
      .post('/api/resource/schema')
      .field('dto', JSON.stringify(schema('page')))
      .expect(201);
    const result = await repository.findById('page');
    expect(result).toMatchObject({ id: 'page' });
  });

  it('/resource/schema/:id (PUT)', async () => {
    await repository.save([schema('user'), schema('page')]);
    const dto = {
      id: 'page',
      entities: [
        `{name: 'page', columns: {id: {type: 'varchar', primary: true}}}`
      ]
    };
    await request(app.getHttpServer())
      .put('/api/resource/schema/page')
      .field('dto', JSON.stringify(dto))
      .expect(200);
    const result = await repository.findById('page');
    expect(result).toMatchObject(dto);
  });

  it('/resource/schema/:id (DELETE)', async () => {
    await repository.save(schema('user'));
    await request(app.getHttpServer())
      .delete('/api/resource/schema/user')
      .expect(200);
    const result = await repository.findById('user');
    expect(result).toBeNull();
  });

  afterEach(async () => {
    await app.close();
  });
});
