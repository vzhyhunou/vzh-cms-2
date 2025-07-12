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
  HttpStatus,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { SchemasService } from './schemas.service';
import { PageablePipe } from '../common/pipe/pageable.pipe';
import { MultipartPipe } from '../common/pipe/multipart.pipe';
import entity from './schema.entity.json';
import { StorageService } from '../storage/storage.service';

const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

@Controller('api')
@Dependencies(SchemasService, StorageService)
export class SchemasController {
  constructor(schemasService, storageService) {
    this.schemasService = schemasService;
    this.storageService = storageService;
  }

  getRepository(resource) {
    const repository = this.schemasService.getRepository(resource);
    if (repository) {
      return repository;
    }
    throw exception;
  }

  @Post(':resource')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(Param('resource'), Body(MultipartPipe), UploadedFiles())
  create(resource, dto, files) {
    const repository = this.getRepository(resource);
    const transformed = this.storageService.replaceFilenames(dto, files);
    return repository.save(transformed);
  }

  @Put(':resource/:id')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(Param('resource'), Body(MultipartPipe), UploadedFiles())
  update(resource, dto, files) {
    const repository = this.getRepository(resource);
    const transformed = this.storageService.replaceFilenames(dto, files);
    return repository.save(transformed);
  }

  @Delete(':resource/:id')
  @Bind(Param('resource'), Param('id'))
  remove(resource, id) {
    const repository = this.getRepository(resource);
    return repository.removeById(id);
  }

  @Get(':resource')
  @Bind(Param('resource'), Query(PageablePipe))
  findAll(resource, { ids, page, size, sort, transform, ...rest }) {
    const repository = this.getRepository(resource);
    if (ids.length) {
      return repository.findByIdIn(ids);
    }
    const filter = Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [
        k,
        transform.includes(k) ? repository.options(v) : v
      ])
    );
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
      throw exception;
    }
    return schema;
  }

  @Get(':resource/component/:name')
  @Bind(Param('resource'), Param('name'), Query())
  async search(resource, name, params) {
    const repository = this.getRepository(entity.id);
    const schema = await repository.findByComponent(resource, name);

    if (!schema) {
      throw exception;
    }

    const { findOne, findOptions, element, title } = schema.components[0];
    const itemsRepository = this.getRepository(resource);
    const content = await itemsRepository[findOne ? 'findOne' : 'find'](
      repository.options(findOptions, { params })
    );

    if (!content) {
      throw exception;
    }

    return {
      content,
      element,
      title: new Function('content', `return ${title}`)(content)
    };
  }
}
