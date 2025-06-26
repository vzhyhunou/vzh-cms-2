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
import * as typeorm from 'typeorm';

import { SchemasService } from './schemas.service';
import { PageablePipe } from '../common/pipe/pageable.pipe';
import entity from './schema.entity.json';

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
  create(resource, dto) {
    const repository = this.getRepository(resource);
    return repository.save(dto);
  }

  @Put(':resource/:id')
  @Bind(Param('resource'), Body())
  update(resource, dto) {
    const repository = this.getRepository(resource);
    return repository.save(dto);
  }

  @Delete(':resource/:id')
  @Bind(Param('resource'), Param('id'))
  remove(resource, id) {
    const repository = this.getRepository(resource);
    return repository.removeById(id);
  }

  @Get(':resource')
  @Bind(Param('resource'), Query(PageablePipe))
  findAll(resource, { ids, page, size, sort, ...rest }) {
    const repository = this.getRepository(resource);
    if (ids.length) {
      return repository.findByIdIn(ids);
    }
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
  async findById(resource, id) {
    const repository = this.getRepository(resource);
    const schema = await repository.findById(id);
    if (!schema) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return schema;
  }

  @Get(':resource/component/:name')
  @Bind(Param('resource'), Param('name'), Query())
  async search(resource, name, params) {
    const repository = this.getRepository(entity.id);
    const schema = await repository.findByComponent(resource, name);

    if (!schema) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const { findOne, findOptions, element, title } = schema.components[0];
    const itemsRepository = this.getRepository(resource);
    const content = await itemsRepository[findOne ? 'findOne' : 'find'](
      new Function('params', ...Object.keys(typeorm), `return ${findOptions}`)(
        params,
        ...Object.values(typeorm)
      )
    );

    if (!content) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return {
      content,
      element,
      title: new Function('content', `return ${title}`)(content)
    };
  }
}
