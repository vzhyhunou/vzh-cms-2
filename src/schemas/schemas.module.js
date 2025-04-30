import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  TypeOrmModule,
  getRepositoryToken,
  getCustomRepositoryToken
} from '@nestjs/typeorm';

import { config } from '../datasource/configuration';
import { Schema } from './schema.entity';
import customRepository from './schemas.repository';
import { SchemasService } from './schemas.service';

@Module({
  imports: [
    ConfigModule.forFeature(config),
    TypeOrmModule.forFeature([Schema])
  ],
  providers: [
    {
      provide: getCustomRepositoryToken(Schema),
      inject: [getRepositoryToken(Schema)],
      useFactory: (repository) => repository.extend(customRepository)
    },
    SchemasService
  ]
})
export class SchemasModule {}
