import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { ConfigModule } from './config/config.module';
import { ResourcesModule } from './resources/resources.module';
import { StaticModule } from './static/static.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true
    }),
    ConfigModule,
    ResourcesModule,
    StaticModule,
    AuthModule
  ]
})
export class AppModule {}
