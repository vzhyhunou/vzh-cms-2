import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSourceService } from './datasource.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService) => configService.get('datasource')
    })
  ],
  providers: [DataSourceService],
  exports: [DataSourceService]
})
export class DataSourceModule {}
