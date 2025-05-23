import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

import se from './schema.entity.json';
import { SchemasController } from './schemas.controller';
import { SchemasService } from './schemas.service';

@Module({
  imports: [TypeOrmModule.forFeature([new EntitySchema(se.value)])],
  controllers: [SchemasController],
  providers: [SchemasService],
  exports: [SchemasService]
})
export class SchemasModule {}
