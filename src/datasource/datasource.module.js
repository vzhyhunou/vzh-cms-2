import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './configuration';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule.forFeature(config)],
      useFactory: (configService) => configService.get('datasource')
    })
  ]
})
export class DatasourceModule {}
