import { getCustomRepositoryToken } from '@nestjs/typeorm';
import {
  Controller,
  Dependencies,
  Get,
  Put,
  Delete,
  Body,
  Post,
  Bind,
  Param,
  Query
} from '@nestjs/common';

import { Schema } from './schema.entity';
import { SchemaPipe } from './schema.pipe';
import { SchemasService } from './schemas.service';

@Controller('api/schemas')
@Dependencies(getCustomRepositoryToken(Schema), SchemasService)
export class SchemasController {
  constructor(repository, service) {
    this.repository = repository;
    this.service = service;
  }

  @Post()
  @Bind(Body(SchemaPipe))
  async create(entity) {
    const result = await this.repository.save(entity);
    await this.service.initialize();
    return result;
  }

  @Put(':id')
  @Bind(Body(SchemaPipe))
  async update(entity) {
    const result = await this.repository.save(entity);
    await this.service.initialize();
    return result;
  }

  @Delete(':id')
  @Bind(Param('id'))
  async remove(id) {
    await this.repository.remove(id);
    await this.service.initialize();
  }

  @Get()
  @Bind(Query())
  findAll({ page = 0, size = 20, sort }) {
    return this.repository
      .findAll(
        page,
        size,
        sort && Array.isArray(sort)
          ? sort.map((s) => s.split(','))
          : [sort.split(',')]
      )
      .then(({ content, totalElements }) => ({
        content,
        page: {
          totalElements
        }
      }));
  }

  @Get(':id')
  @Bind(Param('id'))
  findById(id) {
    return this.repository.findById(id);
  }

  @Get('search/list')
  @Bind(Query())
  list({ id, page = 0, size = 20, sort }) {
    return this.repository
      .list(
        id,
        page,
        size,
        sort && Array.isArray(sort)
          ? sort.map((s) => s.split(','))
          : [sort.split(',')]
      )
      .then(({ content, totalElements }) => ({
        content,
        page: {
          totalElements
        }
      }));
  }
}
