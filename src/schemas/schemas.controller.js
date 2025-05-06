import { getRepositoryToken } from '@nestjs/typeorm';
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
import { SchemasService } from './schemas.service';
import { PageablePipe } from '../common/pipe/pageable.pipe';

@Controller('api/schemas')
@Dependencies(getRepositoryToken(Schema), SchemasService)
export class SchemasController {
  constructor(repository, service) {
    this.repository = repository;
    this.service = service;
  }

  @Post()
  @Bind(Body())
  async create(dto) {
    const entity = this.repository.create(dto);
    const result = await this.repository.save(entity);
    await this.service.initialize();
    return result;
  }

  @Put(':id')
  @Bind(Body())
  async update(dto) {
    const entity = this.repository.create(dto);
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
  @Bind(Query(PageablePipe))
  findAll({ page, size, sort, ...rest }) {
    const filter = this.repository.filter(rest);
    return this.repository
      .findAll(page, size, sort, filter)
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
}
