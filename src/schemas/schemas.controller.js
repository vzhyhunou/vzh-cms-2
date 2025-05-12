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

import { SchemasService } from './schemas.service';
import { PageablePipe } from '../common/pipe/pageable.pipe';

@Controller('api')
@Dependencies(SchemasService)
export class SchemasController {
  constructor(service) {
    this.service = service;
  }

  getRepository(resource) {
    const repository = this.service.getRepository(resource);
    if (repository) {
      return repository;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  @Post(':resource')
  @Bind(Param('resource'), Body())
  async create(resource, dto) {
    const repository = this.getRepository(resource);
    return repository.save(dto);
  }

  @Put(':resource/:id')
  @Bind(Param('resource'), Body())
  async update(resource, dto) {
    const repository = this.getRepository(resource);
    return repository.save(dto);
  }

  @Delete(':resource/:id')
  @Bind(Param('resource'), Param('id'))
  async remove(resource, id) {
    const repository = this.getRepository(resource);
    return repository.remove({
      [repository.getPrimaryColumnName()]: id
    });
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
