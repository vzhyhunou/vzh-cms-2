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
import { BaseController } from '../common/controller/base.controller';

@Controller('api/schemas')
@Dependencies(getCustomRepositoryToken(Schema), SchemasService)
export class SchemasController extends BaseController {
  constructor(repository, service) {
    super();
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
  findAll(query) {
    return super.findAll(this.repository, query);
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
      .list(id, page, size, super.queryParam(sort))
      .then(({ content, totalElements }) => ({
        content,
        page: {
          totalElements
        }
      }));
  }
}
