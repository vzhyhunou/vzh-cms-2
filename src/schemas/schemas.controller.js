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
  UseFilters,
  Request
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { SchemasService } from './schemas.service';
import { PageablePipe } from '../common/pipe/pageable.pipe';
import { MultipartPipe } from '../common/pipe/multipart.pipe';
import { HttpExceptionFilter } from './schemas.filter';
import { StorageService } from '../storage/storage.service';
import { Public } from '../auth/public.decorator';
import { AuditPipe } from '../auth/audit.pipe';

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
  @Bind(Param('resource'), Body(MultipartPipe, AuditPipe), UploadedFiles())
  create(resource, dto, files) {
    const transformed = this.storageService.replaceFilenames(dto, files);
    return this.schemasService.save(resource, transformed);
  }

  @Put(':resource/:id')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(Param('resource'), Body(MultipartPipe, AuditPipe), UploadedFiles())
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

  @Public()
  @Get(':resource/content/:name')
  @Bind(Param('resource'), Param('name'), Request())
  findContent(resource, name, request) {
    return this.schemasService.findContent(resource, name, { request });
  }

  @Public()
  @Get(':resource/component/:name')
  @Bind(Param('resource'), Param('name'))
  findComponent(resource, name) {
    return this.schemasService.findComponent(resource, name);
  }

  @Public()
  @Get()
  @Bind(Query(), Request())
  findResources({ type }, { user: { authorities = [] } = {} }) {
    if (type === 'settings') {
      return this.schemasService.findSettings();
    }
    return this.schemasService.findResources(authorities);
  }
}
