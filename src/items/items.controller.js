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

import { SchemasService } from '../schemas/schemas.service';
import { BaseController } from '../common/controller/base.controller';

@Controller('api/items')
@Dependencies(SchemasService)
export class ItemsController extends BaseController {
  constructor(service) {
    super();
    this.service = service;
  }

  @Post(':schema')
  @Bind(Param('schema'), Body())
  create(schema, dto) {
    const repository = this.service.getRepository(schema);
    return repository.save(dto);
  }

  @Put(':schema/:id')
  @Bind(Param('schema'), Body())
  update(schema, dto) {
    const repository = this.service.getRepository(schema);
    return repository.save(dto);
  }

  @Delete(':schema/:id')
  @Bind(Param('schema'), Param('id'))
  remove(schema, id) {
    const repository = this.service.getRepository(schema);
    repository.remove(id);
  }

  @Get(':schema')
  @Bind(Param('schema'), Query())
  findAll(schema, query) {
    const repository = this.service.getRepository(schema);
    return super.findAll(repository, query);
  }

  @Get(':schema/:id')
  @Bind(Param('schema'), Param('id'))
  findById(schema, id) {
    const repository = this.service.getRepository(schema);
    return repository.findById(id);
  }
}
