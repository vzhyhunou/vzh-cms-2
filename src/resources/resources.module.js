import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ImportService } from './import.service';
import { ImportInitializer } from './import.initializer';
import config from './configuration';
import { ImportController } from './import.controller';
import { SchemasModule } from '../schemas/schemas.module';

@Module({
  imports: [ConfigModule.forFeature(config), SchemasModule],
  controllers: [ImportController],
  providers: [ImportService, ImportInitializer]
})
export class ResourcesModule {}
