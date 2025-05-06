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

  it('/schema (GET)', async () => {
    await repository.save([schema('page'), schema('user')]);
    await request(app.getHttpServer())
      .get('/api/schema?id=s&page=0&size=1&sort=id%2CASC')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [{ id: 'user' }],
          page: { totalElements: 1 }
        });
      });
    await request(app.getHttpServer())
      .get('/api/schema?id=s&page=1&size=1&sort=id%2CASC')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [],
          page: { totalElements: 1 }
        });
      });
  });

  it('/schema/:id (GET)', async () => {
    const user = schema('user');
    const page = schema('page');
    await repository.save([user, page]);
    await request(app.getHttpServer())
      .get('/api/schema/page')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject(page);
      });
  });

  it('/schema (POST)', async () => {
    const user = schema('user');
    await repository.save(user);
    const page = schema('page');
    await request(app.getHttpServer())
      .post('/api/schema')
      .send(page)
      .expect(201);
    const result = await repository.find();
    expect(result).toMatchObject([user, page]);
  });

  it('/schema/:id (PUT)', async () => {
    const user = schema('user');
    let page = schema('page');
    await repository.save([user, page]);
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
      .put('/api/schema/page')
      .send(page)
      .expect(200);
    const result = await repository.find();
    expect(result).toMatchObject([user, page]);
  });

  afterEach(async () => {
    await app.close();
  });
});
