import { Module } from '@nestjs/common';

import { SchemasController } from './schemas.controller';
import { DataSourceModule } from '../datasource/datasource.module';
import { StorageModule } from '../storage/storage.module';
import { SchemasService } from './schemas.service';

@Module({
  imports: [DataSourceModule, StorageModule],
  controllers: [SchemasController],
  providers: [SchemasService],
  exports: [SchemasService]
})
export class SchemasModule {}
