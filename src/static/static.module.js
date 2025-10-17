import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { config } from './configuration';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule.forFeature(config)],
      useFactory: (configService) => [
        {
          rootPath: join(process.cwd(), configService.get('locations.static')),
          serveRoot: '/static'
        },
        {
          rootPath: join(process.cwd(), configService.get('locations.public'))
        }
      ],
      inject: [ConfigService]
    })
  ]
})
export class StaticModule {}
