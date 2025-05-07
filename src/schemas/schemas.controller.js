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
  Query,
  HttpException,
  HttpStatus
} from '@nestjs/common';

import { Schema } from './schema.entity';
import { SchemasService } from './schemas.service';
import { PageablePipe } from '../common/pipe/pageable.pipe';

const SCHEMA = 'schema';

@Controller('api')
@Dependencies(getRepositoryToken(Schema), SchemasService)
export class SchemasController {
  constructor(repository, service) {
    this.repository = repository;
    this.service = service;
  }

  getRepository(resource) {
    if (resource === SCHEMA) {
      return this.repository;
    }
    const repository = this.service.getRepository(resource);
    if (repository) {
      return repository;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  initialize(resource) {
    return resource === SCHEMA && this.service.initialize();
  }

  @Post(':resource')
  @Bind(Param('resource'), Body())
  async create(resource, dto) {
    const repository = this.getRepository(resource);
    const result = await repository.save(dto);
    await this.service.initialize();
    return result;
  }

  @Put(':resource/:id')
  @Bind(Param('resource'), Body())
  async update(resource, dto) {
    const repository = this.getRepository(resource);
    const result = await repository.save(dto);
    await this.service.initialize();
    return result;
  }

  @Delete(':resource/:id')
  @Bind(Param('resource'), Param('id'))
  async remove(resource, id) {
    const repository = this.getRepository(resource);
    await repository.remove({ [repository.getPrimaryColumnName()]: id });
    await this.service.initialize();
  }

  @Get(':resource')
  @Bind(Param('resource'), Query(PageablePipe))
  findAll(resource, { page, size, sort, ...rest }) {
    const repository = this.getRepository(resource);
    const filter = repository.filter(rest);
    return repository
      .findAll(page, size, sort, filter)
      .then(({ content, totalElements }) => ({
        content,
        page: {
          totalElements
        }
      }));
  }

  @Get(':resource/:id')
  @Bind(Param('resource'), Param('id'))
  findById(resource, id) {
    const repository = this.getRepository(resource);
    return repository.findById(id);
  }
}
