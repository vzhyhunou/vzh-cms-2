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
  UploadedFiles,
  UseInterceptors,
  UseFilters
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { SchemasService } from './schemas.service';
import { PageablePipe } from '../common/pipe/pageable.pipe';
import { MultipartPipe } from '../common/pipe/multipart.pipe';
import { HttpExceptionFilter } from './schemas.filter';
import { StorageService } from '../storage/storage.service';

@Controller('api')
@UseFilters(HttpExceptionFilter)
@Dependencies(SchemasService, StorageService)
export class SchemasController {
  constructor(schemasService, storageService) {
    this.schemasService = schemasService;
    this.storageService = storageService;
  }

  @Post(':resource')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(Param('resource'), Body(MultipartPipe), UploadedFiles())
  create(resource, dto, files) {
    const transformed = this.storageService.replaceFilenames(dto, files);
    return this.schemasService.save(resource, transformed);
  }

  @Put(':resource/:id')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(Param('resource'), Body(MultipartPipe), UploadedFiles())
  update(resource, dto, files) {
    const transformed = this.storageService.replaceFilenames(dto, files);
    return this.schemasService.save(resource, transformed);
  }

  @Delete(':resource/:id')
  @Bind(Param('resource'), Param('id'))
  remove(resource, id) {
    return this.schemasService.remove(resource, id);
  }

  @Get(':resource')
  @Bind(Param('resource'), Query(PageablePipe))
  findAll(resource, { ids, ...rest }) {
    if (ids.length) {
      return this.schemasService.findByIdIn(resource, ids);
    }
    return this.schemasService.findAll(resource, rest);
  }

  @Get(':resource/:id')
  @Bind(Param('resource'), Param('id'))
  findById(resource, id) {
    return this.schemasService.findById(resource, id);
  }

  @Get(':resource/content/:name')
  @Bind(Param('resource'), Param('name'), Query())
  findContent(resource, name, params) {
    return this.schemasService.findContent(resource, name, params);
  }

  @Get(':resource/component/:name')
  @Bind(Param('resource'), Param('name'))
  findComponent(resource, name) {
    return this.schemasService.findComponent(resource, name);
  }
}
