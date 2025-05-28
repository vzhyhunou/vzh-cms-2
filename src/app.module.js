import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { SchemasModule } from './schemas/schemas.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [ConfigModule, SchemasModule, ResourcesModule]
})
export class AppModule {}
