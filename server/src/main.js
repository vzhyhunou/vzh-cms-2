import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ServerInterceptor } from './server/server.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const instance = app.getHttpAdapter().getInstance();
  instance.set('json replacer', (key, value) => (value ? value : undefined));
  instance.set('json spaces', 2);
  const configService = app.get(ConfigService);
  app.useLogger(configService.get('logger'));
  app.useGlobalInterceptors(app.get(ServerInterceptor));
  await app.listen(configService.get('port'));
  new Logger(AppModule.name).log(
    `Started ${configService.get('name')} on port ${configService.get('port')}`
  );
}
bootstrap();
