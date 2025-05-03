import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from '../datasource/configuration';
import { Schema } from './schema.entity';
import { SchemasController } from './schemas.controller';
import '../common/repository/base.repository';
import { SchemasService } from './schemas.service';

@Module({
  imports: [
    ConfigModule.forFeature(config),
    TypeOrmModule.forFeature([Schema])
  ],
  controllers: [SchemasController],
  providers: [SchemasService],
  exports: [SchemasService]
})
export class SchemasModule {}
