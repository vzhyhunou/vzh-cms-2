import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import config from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [`./${process.env.NODE_ENV}.env`, './.env'],
      load: [config],
      expandVariables: true
    })
  ]
})
export class ConfigModule {}
