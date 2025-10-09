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

  async create(resource, entity, params, call) {
    const entityId = this.schemasService.getId(resource, entity);
    await this.eventEmitter.emitAsync('before.create', resource, {
      entityId,
      entity,
      ...params
    });
    const updatedEntity = await call();
    await this.eventEmitter.emitAsync('after.create', resource, {
      entityId,
      entity,
      updatedEntity,
      ...params
    });
    return updatedEntity;
  }

  async update(resource, entity, params, call) {
    const entityId = this.schemasService.getId(resource, entity);
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
      databaseEntity,
      ...params
    });
    const updatedEntity = await call();
    await this.eventEmitter.emitAsync('after.update', resource, {
      entityId,
      entity,
      databaseEntity,
      updatedEntity,
      ...params
    });
    return updatedEntity;
  }

  async remove(resource, entityId, params, call) {
    const databaseEntity = await this.schemasService.findById(
      resource,
      entityId
    );
    if (!databaseEntity) {
      throw new NotFoundException();
    }
    await this.eventEmitter.emitAsync('before.remove', resource, {
      entityId,
      databaseEntity,
      ...params
    });
    const updatedEntity = await call();
    await this.eventEmitter.emitAsync('after.remove', resource, {
      entityId,
      databaseEntity,
      ...params
    });
    return updatedEntity;
  }
}
