import getFuncProvider from './func';

describe('functions', () => {
  it('fileSrc', async () => {
    const result = await getFuncProvider().fileSrc(
      'origin',
      '900150983cd24fb0d6963f7d28e17f71.png'
    );
    expect(result).toEqual(
      '/static/origin/900150983cd24fb0d6963f7d28e17f71.png'
    );
  });

  it('fileOrigin no param', async () => {
    const result = await getFuncProvider().fileOrigin(
      '900150983cd24fb0d6963f7d28e17f71.png'
    );
    expect(result).toEqual(
      '/static/origin/900150983cd24fb0d6963f7d28e17f71.png'
    );
  });

  it('fileOrigin no context', async () => {
    const result = await getFuncProvider({}).fileOrigin(
      '900150983cd24fb0d6963f7d28e17f71.png'
    );
    expect(result).toEqual(
      '/static/origin/900150983cd24fb0d6963f7d28e17f71.png'
    );
  });

  it('fileOrigin', async () => {
    const result = await getFuncProvider({ basename: 'a' }).fileOrigin(
      '900150983cd24fb0d6963f7d28e17f71.png'
    );
    expect(result).toEqual(
      'a/static/origin/900150983cd24fb0d6963f7d28e17f71.png'
    );
  });
});
