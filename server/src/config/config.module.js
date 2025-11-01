import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import merge from 'lodash/merge';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [
        Promise.all([
          import('../../config').catch(() => {}),
          import(`../../${process.env.NODE_ENV}.config`).catch(() => {})
        ]).then(
          (args) => () =>
            args
              .filter((c) => c)
              .map((c) => c.default())
              .reduce(merge, {})
        )
      ]
    })
  ]
})
export class ConfigModule {}
