import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { ResourcesModule } from './resources/resources.module';
import { StaticModule } from './static/static.module';
import { AuthModule } from './auth/auth.module';
import { I18nModule } from './i18n/i18n.module';

@Module({
  imports: [
    ConfigModule,
    ResourcesModule,
    StaticModule,
    AuthModule,
    I18nModule
  ]
})
export class AppModule {}
