import { Test } from '@nestjs/testing';
import request from 'supertest';

import schema from './schema.fixture';
import entity from '../../src/schemas/schema.entity.json';
import { ConfigModule } from '../../src/config/config.module';
import { SchemasModule } from '../../src/schemas/schemas.module';
import { SchemasService } from '../../src/schemas/schemas.service';

describe('Items (e2e)', () => {
  let itemsRepository;
  let app;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ConfigModule, SchemasModule]
    }).compile();

    const service = moduleFixture.get(SchemasService);
    app = moduleFixture.createNestApplication();

    await app.init();

    const repository = service.getRepository(entity.id);
    await repository.save(schema('user'));
    itemsRepository = service.getRepository('user');
  });

  it('should be defined', () => {
    expect(itemsRepository).toBeDefined();
  });

  describe('/user (GET)', () => {
    it('should return a page of users', async () => {
      await itemsRepository.save([{ id: 'admin' }, { id: 'manager' }]);
      await request(app.getHttpServer())
        .get(
          '/api/user?id=Like%28%27%25d%25%27%29&transform=id&page=0&size=1&sort=id%2CASC'
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
          '/api/user?id=Like%28%27%25d%25%27%29&transform=id&page=1&size=1&sort=id%2CASC'
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
      await itemsRepository.save([{ id: 'admin' }, { id: 'manager' }]);
      await request(app.getHttpServer())
        .get('/api/user?ids=admin&ids=manager')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject([{ id: 'admin' }, { id: 'manager' }]);
        });
    });
  });

  it('/user/:id (GET)', async () => {
    const admin = { id: 'admin' };
    const manager = { id: 'manager' };
    await itemsRepository.save([admin, manager]);
    await request(app.getHttpServer())
      .get('/api/user/manager')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject(manager);
      });
  });

  it('/user (POST)', async () => {
    const admin = { id: 'admin' };
    await itemsRepository.save(admin);
    const manager = { id: 'manager' };
    await request(app.getHttpServer())
      .post('/api/user')
      .field('dto', JSON.stringify(manager))
      .expect(201);
    const result = await itemsRepository.find();
    expect(result).toMatchObject([admin, manager]);
  });

  it('/user/:id (PUT)', async () => {
    const admin = { id: 'admin' };
    let manager = { id: 'manager', f: 'a' };
    await itemsRepository.save([admin, manager]);
    manager = {
      id: 'manager'
    };
    await request(app.getHttpServer())
      .put('/api/user/manager')
      .field('dto', JSON.stringify(manager))
      .expect(200);
    const result = await itemsRepository.find();
    expect(result).toMatchObject([admin, manager]);
  });

  it('/user/:id (DELETE)', async () => {
    const admin = { id: 'admin' };
    await itemsRepository.save(admin);
    await request(app.getHttpServer()).delete('/api/user/admin').expect(200);
    const result = await itemsRepository.findById('admin');
    expect(result).toBeNull();
  });

  afterEach(async () => {
    await app.close();
  });
});
