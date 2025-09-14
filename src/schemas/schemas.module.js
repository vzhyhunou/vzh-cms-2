import { Module } from '@nestjs/common';

import { SchemasController } from './schemas.controller';
import { DataSourceModule } from '../datasource/datasource.module';
import { StorageModule } from '../storage/storage.module';
import { SchemasService } from './schemas.service';
import { SchemasEmitter } from './schemas.emitter';
import { SchemasListener } from './schemas.listener';

@Module({
  imports: [DataSourceModule, StorageModule],
  controllers: [SchemasController],
  providers: [SchemasService, SchemasEmitter, SchemasListener],
  exports: [SchemasService]
})
export class SchemasModule {}
