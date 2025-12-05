import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ServerInterceptor } from './server.interceptor';

@Module({
  imports: [ConfigModule],
  providers: [ServerInterceptor]
})
export class ServerModule {}
