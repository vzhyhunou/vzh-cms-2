import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { ResourcesModule } from './resources/resources.module';
import { StaticModule } from './static/static.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule, ResourcesModule, StaticModule, AuthModule]
})
export class AppModule {}
