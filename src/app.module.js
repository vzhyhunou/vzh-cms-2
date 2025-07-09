import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [ConfigModule, ResourcesModule]
})
export class AppModule {}
