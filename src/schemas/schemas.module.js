import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

import { entities } from './schema.entity.json';
import { SchemasController } from './schemas.controller';
import { DataSourceModule } from '../datasource/datasource.module';
import { StorageModule } from '../storage/storage.module';
import { SchemasService } from './schemas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      entities.map((e) => new EntitySchema(new Function(`return ${e}`)()))
    ),
    DataSourceModule,
    StorageModule
  ],
  controllers: [SchemasController],
  providers: [SchemasService],
  exports: [SchemasService]
})
export class SchemasModule {}
