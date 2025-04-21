import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [`./${process.env.NODE_ENV}.env`, './.env'],
      expandVariables: true
    })
  ]
})
export class ConfigModule {}
