import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';

import schema from './schema.fixture';
import { Schema } from '../../src/schemas/schema.entity';
import { DataSourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import { SchemasModule } from '../../src/schemas/schemas.module';

describe('SchemasController (e2e)', () => {
  let repository;
  let app;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ConfigModule, DataSourceModule, SchemasModule]
    }).compile();

    repository = moduleFixture.get(getRepositoryToken(Schema));
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('/schemas (GET)', async () => {
    const entities = repository.create([schema('page'), schema('user')]);
    await repository.save(entities);
    await request(app.getHttpServer())
      .get('/api/schemas?page=0&size=10&sort=id%2CASC')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: entities,
          page: { totalElements: 2 }
        });
      });
  });

  it('/schemas/:id (GET)', async () => {
    const user = repository.create(schema('user'));
    await repository.save(user);
    const page = repository.create(schema('page'));
    await repository.save(page);
    await request(app.getHttpServer())
      .get('/api/schemas/page')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject(page);
      });
  });

  it('/schemas (POST)', async () => {
    const user = repository.create(schema('user'));
    await repository.save(user);
    const page = schema('page');
    await request(app.getHttpServer())
      .post('/api/schemas')
      .send(page)
      .expect(201);
    const result = await repository.find();
    expect(result).toMatchObject([user, page]);
  });

  it('/schemas/:id (PUT)', async () => {
    const user = repository.create(schema('user'));
    await repository.save(user);
    let page = repository.create(schema('page'));
    await repository.save(page);
    page = {
      id: 'page',
      value: JSON.stringify({
        name: 'page',
        columns: {
          id: {
            type: 'varchar',
            primary: true
          },
          a: {
            type: 'varchar'
          }
        }
      })
    };
    await request(app.getHttpServer())
      .put('/api/schemas/page')
      .send(page)
      .expect(200);
    const result = await repository.find();
    expect(result).toMatchObject([user, page]);
  });

  it('/schemas/search/list (GET)', async () => {
    const entities = repository.create([schema('user'), schema('page')]);
    await repository.save(entities);
    await request(app.getHttpServer())
      .get('/api/schemas/search/list?id=s&page=0&size=1&sort=id%2CASC')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [{ id: 'user' }],
          page: { totalElements: 1 }
        });
      });
    await request(app.getHttpServer())
      .get('/api/schemas/search/list?id=s&page=1&size=1&sort=id%2CASC')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [],
          page: { totalElements: 1 }
        });
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
