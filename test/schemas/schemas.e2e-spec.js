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
      .field('dto', JSON.stringify(page))
      .expect(201);
    const result = await repository.find({
      relations: { contents: true, components: true }
    });
    expect(result).toMatchObject([entity, user, page]);
  });

  it('/schema/:id (PUT)', async () => {
    const user = schema('user');
    let page = schema('page');
    await repository.save([user, page]);
    page = {
      id: 'page',
      entities: [
        `{name: 'page', columns: {id: {type: 'varchar', primary: true}, a: {type: 'varchar'}}}`
      ],
      data: []
    };
    await request(app.getHttpServer())
      .put('/api/schema/page')
      .field('dto', JSON.stringify(page))
      .expect(200);
    const result = await repository.find({
      relations: { contents: true, components: true }
    });
    expect(result).toMatchObject([entity, user, page]);
  });

  afterEach(async () => {
    await app.close();
  });
});
