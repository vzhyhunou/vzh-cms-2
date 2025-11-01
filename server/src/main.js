import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const instance = app.getHttpAdapter().getInstance();
  instance.set('json replacer', (key, value) => (value ? value : undefined));
  instance.set('json spaces', 2);
  const configService = app.get(ConfigService);
  app.useLogger(configService.get('config.logger'));
  await app.listen(configService.get('config.port'));
}
bootstrap();
