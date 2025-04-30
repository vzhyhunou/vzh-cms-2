import { ValidationPipe } from '@nestjs/common';

import { Schema } from './schema.entity';

export class SchemaPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      expectedType: Schema
    });
  }
}
