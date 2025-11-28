import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => [
        {
          rootPath: path.join(
            process.cwd(),
            configService.get('locations.static')
          ),
          serveRoot: '/static'
        },
        {
          rootPath: path.join(
            process.cwd(),
            configService.get('locations.public')
          )
        }
      ],
      inject: [ConfigService]
    })
  ]
})
export class StaticModule {}
