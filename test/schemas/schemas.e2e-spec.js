import { Test } from '@nestjs/testing';
import request from 'supertest';

import schema from './schema.fixture';
import entity from '../../src/schemas/schema.entity.json';
import { ConfigModule } from '../../src/config/config.module';
import { SchemasModule } from '../../src/schemas/schemas.module';
import { SchemasService } from '../../src/schemas/schemas.service';

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

    repository = service.getRepository(entity.id);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('/schema (GET)', () => {
    it('should return a page of schemas', async () => {
      await repository.save([schema('page'), schema('user')]);
      await request(app.getHttpServer())
        .get(
          '/api/schema?id=Like%28%27%25g%25%27%29&transform=id&page=0&size=1&sort=id%2CASC'
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
          '/api/schema?id=Like%28%27%25g%25%27%29&transform=id&page=1&size=1&sort=id%2CASC'
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
        .get('/api/schema?ids=page&ids=user')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject([{ id: 'page' }, { id: 'user' }]);
        });
    });
  });

  it('/schema/:id (GET)', async () => {
    await repository.save([schema('page'), schema('user')]);
    await request(app.getHttpServer())
      .get('/api/schema/page')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({ id: 'page' });
      });
  });

  it('/schema (POST)', async () => {
    await repository.save(schema('user'));
    await request(app.getHttpServer())
      .post('/api/schema')
      .field('dto', JSON.stringify(schema('page')))
      .expect(201);
    const result = await repository.findById('page');
    expect(result).toMatchObject({ id: 'page' });
  });

  it('/schema/:id (PUT)', async () => {
    await repository.save([schema('user'), schema('page')]);
    const dto = {
      id: 'page',
      entities: [
        `{name: 'page', columns: {id: {type: 'varchar', primary: true}}}`
      ],
      data: []
    };
    await request(app.getHttpServer())
      .put('/api/schema/page')
      .field('dto', JSON.stringify(dto))
      .expect(200);
    const result = await repository.findById('page');
    expect(result).toMatchObject(dto);
  });

  it('/schema/:id (DELETE)', async () => {
    await repository.save(schema('user'));
    await request(app.getHttpServer()).delete('/api/schema/user').expect(200);
    const result = await repository.findById('user');
    expect(result).toBeNull();
  });

  afterEach(async () => {
    await app.close();
  });
});
