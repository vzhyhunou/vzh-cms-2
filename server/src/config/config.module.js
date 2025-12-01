import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import merge from 'lodash/merge';
import path from 'path';

import configuration from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [
        Promise.all([
          import(path.join(process.cwd(), 'config')).catch(() => {}),
          import(
            path.join(process.cwd(), `${process.env.NODE_ENV}.config`)
          ).catch(() => {})
        ]).then(
          (args) => () =>
            args
              .filter((c) => c)
              .map((c) => c.default)
              .reduce(merge, { ...configuration })
        )
      ]
    })
  ]
})
export class ConfigModule {}
