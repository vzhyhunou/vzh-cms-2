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
import { PageablePipe } from '../common/pipe/pageable.pipe';

@Controller('api/items')
@Dependencies(SchemasService)
export class ItemsController {
  constructor(service) {
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
  @Bind(Param('schema'), Query(PageablePipe))
  findAll(schema, { page, size, sort }) {
    const repository = this.service.getRepository(schema);
    return repository
      .findAll(page, size, sort)
      .then(({ content, totalElements }) => ({
        content,
        page: {
          totalElements
        }
      }));
  }

  @Get(':schema/:id')
  @Bind(Param('schema'), Param('id'))
  findById(schema, id) {
    const repository = this.service.getRepository(schema);
    return repository.findById(id);
  }
}
