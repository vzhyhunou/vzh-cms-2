import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';

import schema from '../schemas/schema.fixture';
import { Schema } from '../../src/schemas/schema.entity';
import { DataSourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import { ItemsModule } from '../../src/items/items.module';
import { SchemasService } from '../../src/schemas/schemas.service';

describe('ItemsController (e2e)', () => {
  let itemsRepository;
  let app;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ConfigModule, DataSourceModule, ItemsModule]
    }).compile();

    const repository = moduleFixture.get(getRepositoryToken(Schema));
    const service = moduleFixture.get(SchemasService);
    app = moduleFixture.createNestApplication();

    await app.init();

    const user = repository.create(schema('user'));
    await repository.save(user);
    await service.initialize();
    itemsRepository = service.getRepository('user');
  });

  it('/items/user (GET)', async () => {
    const items = [{ id: 'admin' }, { id: 'manager' }];
    await itemsRepository.save(items);
    await request(app.getHttpServer())
      .get('/api/items/user?id=d&page=0&size=1&sort=id%2CASC')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [{ id: 'admin' }],
          page: { totalElements: 1 }
        });
      });
    await request(app.getHttpServer())
      .get('/api/items/user?id=d&page=1&size=1&sort=id%2CASC')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [],
          page: { totalElements: 1 }
        });
      });
  });

  it('/items/user/:id (GET)', async () => {
    const admin = { id: 'admin' };
    await itemsRepository.save(admin);
    const manager = { id: 'manager' };
    await itemsRepository.save(manager);
    await request(app.getHttpServer())
      .get('/api/items/user/manager')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject(manager);
      });
  });

  it('/items/user (POST)', async () => {
    const admin = { id: 'admin' };
    await itemsRepository.save(admin);
    const manager = { id: 'manager' };
    await request(app.getHttpServer())
      .post('/api/items/user')
      .send(manager)
      .expect(201);
    const result = await itemsRepository.find();
    expect(result).toMatchObject([admin, manager]);
  });

  it('/items/user/:id (PUT)', async () => {
    const admin = { id: 'admin' };
    await itemsRepository.save(admin);
    let manager = { id: 'manager', f: 'a' };
    await itemsRepository.save(manager);
    manager = {
      id: 'manager',
      f: 'b'
    };
    await request(app.getHttpServer())
      .put('/api/items/user/manager')
      .send(manager)
      .expect(200);
    const result = await itemsRepository.find();
    expect(result).toMatchObject([admin, manager]);
  });

  afterEach(async () => {
    await app.close();
  });
});
