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
import { I18nContext } from 'nestjs-i18n';

import { SchemasService } from './schemas.service';
import { ParamsPipe } from '../common/params.pipe';
import { HttpExceptionFilter } from './schemas.filter';
import { StorageService } from '../storage/storage.service';
import { Public } from '../auth/public.decorator';

@Controller('api')
@UseFilters(HttpExceptionFilter)
@Dependencies(SchemasService, StorageService)
export class SchemasController {
  constructor(schemasService, storageService) {
    this.schemasService = schemasService;
    this.storageService = storageService;
  }

  @Post('resource/:resource')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(Param('resource'), Body(), UploadedFiles(), Request())
  create(resource, { dto }, files, request) {
    const transformed = this.storageService.replaceFilenames(dto, files);
    return this.schemasService.create(resource, transformed, { request });
  }

  @Put('resource/:resource/:id')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(Param('resource'), Body(), UploadedFiles(), Request())
  update(resource, { dto }, files, request) {
    const transformed = this.storageService.replaceFilenames(dto, files);
    return this.schemasService.update(resource, transformed, { request });
  }

  @Delete('resource/:resource/:id')
  @Bind(Param('resource'), Param('id'))
  removeById(resource, id) {
    return this.schemasService.removeById(resource, id);
  }

  @Delete('resource/:resource')
  @Bind(Param('resource'), Query(ParamsPipe))
  removeByIdIn(resource, { ids }) {
    return this.schemasService.removeByIdIn(resource, ids);
  }

  @Get('resource/:resource')
  @Bind(Param('resource'), Query(ParamsPipe))
  findAll(resource, { ids, ...rest }) {
    if (ids.length) {
      return this.schemasService.findByIdIn(resource, ids);
    }
    return this.schemasService.findAll(resource, rest);
  }

  @Get('resource/:resource/:id')
  @Bind(Param('resource'), Param('id'))
  findById(resource, id) {
    return this.schemasService.findById(resource, id);
  }

  @Public()
  @Get('content/:resource/:name')
  @Bind(Param('resource'), Param('name'), Request())
  findContent(resource, name, request) {
    return this.schemasService.findContent(resource, name, {
      request,
      system: { locale: I18nContext.current().lang }
    });
  }

  @Public()
  @Get('component/:resource/:name')
  @Bind(Param('resource'), Param('name'))
  findComponent(resource, name) {
    return this.schemasService.findComponent(resource, name);
  }

  @Public()
  @Get('admin')
  @Bind(Request())
  getResources({ user: { authorities = [] } = {} }) {
    return this.schemasService.findResources(authorities);
  }

  @Public()
  @Get('settings')
  getSettings() {
    return this.schemasService.findSettings();
  }

  @Public()
  @Get('messages')
  getMessages() {
    return this.schemasService.findMessages(I18nContext.current().lang);
  }
}
