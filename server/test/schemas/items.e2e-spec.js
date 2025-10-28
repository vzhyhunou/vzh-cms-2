import { Test } from '@nestjs/testing';
import request from 'supertest';

import schema from './schema.fixture';
import entity from './entity.fixture';
import { ConfigModule } from '../../src/config/config.module';
import { SchemasModule } from '../../src/schemas/schemas.module';
import { SchemasService } from '../../src/schemas/schemas.service';

const SCHEMA = 'schema';

describe('Items (e2e)', () => {
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
    await service.save(SCHEMA, schema('user'));
    repository = service.getRepository('user');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('/resource/user (GET)', () => {
    it('should return a page of users', async () => {
      await repository.save([{ id: 'admin' }, { id: 'manager' }]);
      await request(app.getHttpServer())
        .get(
          '/api/resource/user?id=Like%28%27%25d%25%27%29&parse=id&page=0&size=1&sort=id%2CASC'
        )
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            content: [{ id: 'admin' }],
            page: { totalElements: 1 }
          });
        });
      await request(app.getHttpServer())
        .get(
          '/api/resource/user?id=Like%28%27%25d%25%27%29&parse=id&page=1&size=1&sort=id%2CASC'
        )
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            content: [],
            page: { totalElements: 1 }
          });
        });
    });

    it('should return an array of users', async () => {
      await repository.save([{ id: 'admin' }, { id: 'manager' }]);
      await request(app.getHttpServer())
        .get('/api/resource/user?ids=admin&ids=manager')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject([{ id: 'admin' }, { id: 'manager' }]);
        });
    });
  });

  it('/resource/user/:id (GET)', async () => {
    await repository.save([{ id: 'admin' }, { id: 'manager' }]);
    await request(app.getHttpServer())
      .get('/api/resource/user/manager')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({ id: 'manager' });
      });
  });

  it('/resource/user (POST)', async () => {
    await repository.save({ id: 'admin' });
    await request(app.getHttpServer())
      .post('/api/resource/user')
      .field('dto', JSON.stringify({ id: 'manager' }))
      .expect(201);
    const result = await repository.findById('manager');
    expect(result).toMatchObject({ id: 'manager' });
  });

  it('/resource/user/:id (PUT)', async () => {
    await repository.save([{ id: 'admin' }, { id: 'manager' }]);
    const dto = {
      id: 'manager',
      data: 'a'
    };
    await request(app.getHttpServer())
      .put('/api/resource/user/manager')
      .field('dto', JSON.stringify(dto))
      .expect(200);
    const result = await repository.findById('manager');
    expect(result).toMatchObject(dto);
  });

  it('/resource/user/:id (DELETE)', async () => {
    await repository.save({ id: 'admin' });
    await request(app.getHttpServer())
      .delete('/api/resource/user/admin')
      .expect(200);
    const result = await repository.findById('admin');
    expect(result).toBeNull();
  });

  afterEach(async () => {
    await app.close();
  });
});
