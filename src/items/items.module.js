import { Module } from '@nestjs/common';

import { ItemsController } from './items.controller';
import { SchemasModule } from '../schemas/schemas.module';

@Module({
  imports: [SchemasModule],
  controllers: [ItemsController]
})
export class ItemsModule {}
