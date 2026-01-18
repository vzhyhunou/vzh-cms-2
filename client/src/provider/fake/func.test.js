import getFuncProvider from './func';

describe('functions', () => {
  let schemasService;

  beforeAll(() => {
    schemasService = { findById: async () => ({ value: 'abc' }) };
  });

  it('fileSrc', async () => {
    const result = await getFuncProvider({ schemasService }).fileSrc(
      'origin',
      '900150983cd24fb0d6963f7d28e17f71.png'
    );
    expect(result).toEqual('data:image/png;base64,abc');
  });

  it('fileOrigin no param', async () => {
    const result = await getFuncProvider({ schemasService }).fileOrigin(
      '900150983cd24fb0d6963f7d28e17f71.png'
    );
    expect(result).toEqual('data:image/png;base64,abc');
  });

  it('fileOrigin', async () => {
    const result = await getFuncProvider({
      schemasService,
      basename: 'a'
    }).fileOrigin('900150983cd24fb0d6963f7d28e17f71.png');
    expect(result).toEqual('data:image/png;base64,abc');
  });
});
