import { Dependencies, Injectable } from '@nestjs/common';

import { SchemasService } from './schemas.service';
import parse from './parse';
import { SchemasEmitter } from './schemas.emitter';

@Injectable()
@Dependencies(SchemasService, SchemasEmitter)
export class SchemasListener {
  constructor(schemasService, schemasEmitter) {
    schemasEmitter.onAny(
      async (name, resource, params) => {
        const code = await schemasService.findEvent(resource, name);
        code && parse(code, params);
      },
      { promisify: false }
    );
  }
}
