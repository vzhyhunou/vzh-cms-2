import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

import { entity } from './schema.entity.json';
import { SchemasController } from './schemas.controller';
import { DataSourceModule } from '../datasource/datasource.module';
import { SchemasService } from './schemas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([new EntitySchema(entity)]),
    DataSourceModule
  ],
  controllers: [SchemasController],
  providers: [SchemasService]
})
export class SchemasModule {}
