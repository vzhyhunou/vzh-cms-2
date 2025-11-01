import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
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
