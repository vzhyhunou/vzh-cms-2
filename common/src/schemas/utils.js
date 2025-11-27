import { transform as t } from '@babel/standalone';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

export const transform = (element) =>
  t(`const result = <>${element}</>`, {
    presets: ['react', 'env']
  }).code;

export const sanitize = (code, { ADD_TAGS = [], ...rest } = {}) => {
  const sanitized = DOMPurify(new JSDOM('').window).sanitize(
    `<root>${code}</root>`,
    {
      ...rest,
      ADD_TAGS: ['root', ...ADD_TAGS]
    }
  );
  return sanitized.match(/<[^>]*>([\s|\S]*)</)[1];
};
