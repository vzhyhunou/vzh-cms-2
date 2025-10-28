import { Module } from '@nestjs/common';
import { I18nModule as NestI18nModule } from 'nestjs-i18n';

import { AcceptLanguageResolver } from './resolver';

@Module({
  imports: [
    NestI18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: __dirname
      },
      resolvers: [AcceptLanguageResolver]
    })
  ]
})
export class I18nModule {}
