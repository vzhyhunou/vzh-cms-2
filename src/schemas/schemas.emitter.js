import { Injectable, Dependencies } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SchemasService } from './schemas.service';
import { NotFoundException } from './schemas.exception';

@Injectable()
@Dependencies(SchemasService, EventEmitter2)
export class SchemasEmitter {
  constructor(schemasService, eventEmitter) {
    this.schemasService = schemasService;
    this.eventEmitter = eventEmitter;
  }

  async create(resource, entity, call) {
    const repository = this.schemasService.getRepository(resource);
    const entityId = repository.getId(entity);
    await this.eventEmitter.emitAsync('before.create', resource, {
      entityId,
      entity
    });
    const updatedEntity = await call();
    await this.eventEmitter.emitAsync('after.create', resource, {
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
    await this.eventEmitter.emitAsync('before.update', resource, {
      entityId,
      entity,
      databaseEntity
    });
    const updatedEntity = await call();
    await this.eventEmitter.emitAsync('after.update', resource, {
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
    await this.eventEmitter.emitAsync('before.remove', resource, {
      entityId,
      databaseEntity
    });
    const updatedEntity = await call();
    await this.eventEmitter.emitAsync('after.remove', resource, {
      entityId,
      databaseEntity
    });
    return updatedEntity;
  }
}
