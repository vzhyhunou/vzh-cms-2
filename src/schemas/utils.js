import { transform as t } from '@babel/standalone';

export const transform = (element) =>
  t(`const result = <>${element}</>`, {
    presets: ['react', 'env']
  }).code;
