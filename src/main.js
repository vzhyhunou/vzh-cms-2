import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(
      (await import(`./${process.env.LOGGER_OPTIONS}`)).default
    )
  });
  const configService = app.get(ConfigService);
  app.getHttpAdapter().getInstance().set('json spaces', 2);
  await app.listen(configService.get('config.port'));
}
bootstrap();
