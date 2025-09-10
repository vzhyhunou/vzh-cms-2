import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

import schemaEntity from './schema.entity.json';
import { SchemasController } from './schemas.controller';
import { DataSourceModule } from '../datasource/datasource.module';
import { StorageModule } from '../storage/storage.module';
import { SchemasService } from './schemas.service';
import { SchemasEmitter } from './schemas.emitter';
import { SchemasListener } from './schemas.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      schemaEntity.entities.map(
        (e) => new EntitySchema(new Function(`return ${e}`)())
      )
    ),
    DataSourceModule,
    StorageModule
  ],
  controllers: [SchemasController],
  providers: [SchemasService, SchemasEmitter, SchemasListener],
  exports: [SchemasService]
})
export class SchemasModule {}
