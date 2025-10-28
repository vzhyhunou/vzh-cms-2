import { StorageService } from './storage.service';

describe('StorageService', () => {
  let subj;

  beforeAll(() => {
    const configService = { get: () => 'path' };
    subj = new StorageService(configService);
  });

  it('replaceFilenames()', () => {
    const dto = {
      image: 'name2.png',
      body: '<img src="name.png"/>'
    };
    const files = [
      {
        originalname: 'name2.png',
        filename: 'a6b1fe048182b876c7472e431fae9ba9.png'
      },
      {
        originalname: 'name.png',
        filename: 'a6b1fe048182b876c7472e431fae9ba8.png'
      }
    ];
    const result = subj.replaceFilenames(dto, files);
    expect(result).toMatchObject({
      image: 'a6b1fe048182b876c7472e431fae9ba9.png',
      body: '<img src="a6b1fe048182b876c7472e431fae9ba8.png"/>'
    });
  });

  it('getFilenames()', () => {
    const dto = {
      image: 'a6b1fe048182b876c7472e431fae9ba9.png',
      body: '<img src="a6b1fe048182b876c7472e431fae9ba8.png"/>'
    };
    const result = subj.getFilenames(dto);
    expect(result).toMatchObject([
      'path/a6b1fe048182b876c7472e431fae9ba9.png',
      'path/a6b1fe048182b876c7472e431fae9ba8.png'
    ]);
  });
});
