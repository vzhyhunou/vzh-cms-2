import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { ImportService } from './import.service';
import { ImportInitializer } from './import.initializer';
import config from './configuration';
import { ImportController } from './import.controller';
import { SchemasModule } from '../schemas/schemas.module';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { ExportScheduler } from './export.scheduler';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    ConfigModule.forFeature(config),
    ScheduleModule.forRoot(),
    SchemasModule,
    StorageModule
  ],
  controllers: [ImportController, ExportController],
  providers: [ImportService, ImportInitializer, ExportService, ExportScheduler]
})
export class ResourcesModule {}
