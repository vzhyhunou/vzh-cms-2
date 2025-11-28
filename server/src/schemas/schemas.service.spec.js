import { SchemasService } from './schemas.service';

describe('SchemasService', () => {
  let subj;

  beforeAll(() => {
    subj = new SchemasService();
  });

  it('sanitize()', () => {
    const result = subj.sanitize(
      '<h1 onclick="">[<S onClick="" a="v">\nt\n</S>]</h1>',
      {
        PARSER_MEDIA_TYPE: 'application/xhtml+xml',
        ADD_TAGS: ['S'],
        ADD_ATTR: ['a']
      }
    );
    expect(result).toEqual('<h1>[<S a="v">\nt\n</S>]</h1>');
  });
});
