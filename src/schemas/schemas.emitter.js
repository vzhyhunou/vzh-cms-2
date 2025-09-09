import { Injectable, Dependencies } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SchemasService } from './schemas.service';
import { NotFoundException } from './schemas.exception';

@Injectable()
@Dependencies(SchemasService)
export class SchemasEmitter extends EventEmitter2 {
  constructor(schemasService) {
    super();
    this.schemasService = schemasService;
  }

  async create(resource, entity, call) {
    const repository = this.schemasService.getRepository(resource);
    const entityId = repository.getId(entity);
    await super.emitAsync('before.create', resource, {
      entityId,
      entity
    });
    const updatedEntity = await call();
    await super.emitAsync('after.create', resource, {
      entityId,
      entity,
      updatedEntity
    });
    return updatedEntity;
  }

  async update(resource, entity, call) {
    const repository = this.schemasService.getRepository(resource);
    const entityId = repository.getId(entity);
    const databaseEntity = await this.schemasService.findById(
      resource,
      entityId
    );
    if (!databaseEntity) {
      throw new NotFoundException();
    }
    await super.emitAsync('before.update', resource, {
      entityId,
      entity,
      databaseEntity
    });
    const updatedEntity = await call();
    await super.emitAsync('after.update', resource, {
      entityId,
      entity,
      databaseEntity,
      updatedEntity
    });
    return updatedEntity;
  }

  async remove(resource, entityId, call) {
    const databaseEntity = await this.schemasService.findById(
      resource,
      entityId
    );
    if (!databaseEntity) {
      throw new NotFoundException();
    }
    await super.emitAsync('before.remove', resource, {
      entityId,
      databaseEntity
    });
    const updatedEntity = await call();
    await super.emitAsync('after.remove', resource, {
      entityId,
      databaseEntity
    });
    return updatedEntity;
  }
}
