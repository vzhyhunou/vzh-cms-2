import { Dependencies, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SchemasService } from './schemas.service';
import parse from './parse';

@Injectable()
@Dependencies(SchemasService, EventEmitter2)
export class SchemasListener {
  constructor(schemasService, eventEmitter) {
    eventEmitter.onAny(
      async (name, resource, params) => {
        const code = await schemasService.findEvent(resource, name);
        code && parse(code, params);
      },
      { promisify: false }
    );
  }
}
