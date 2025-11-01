import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { hashStorage } from './storage.engine';
import { StorageService } from './storage.service';

@Module({
  imports: [
    ConfigModule,
    MulterModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService) => ({
        storage: hashStorage({
          destination: configService.get('locations.origin'),
          filename: (req, { hash, mimetype }, cb) =>
            cb(null, `${hash}.${mimetype.split('/')[1]}`)
        })
      })
    })
  ],
  providers: [StorageService],
  exports: [MulterModule, StorageService]
})
export class StorageModule {}
