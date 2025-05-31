import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

import { entity } from './schema.entity.json';
import { SchemasController } from './schemas.controller';
import { DataSourceModule } from '../datasource/datasource.module';
import { SchemasService } from './schemas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([new EntitySchema(JSON.parse(entity))]),
    DataSourceModule
  ],
  controllers: [SchemasController],
  providers: [SchemasService],
  exports: [SchemasService]
})
export class SchemasModule {}
