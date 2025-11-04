import { StorageService } from './storage.service';

describe('StorageService', () => {
  let subj;

  beforeAll(() => {
    subj = new StorageService();
  });

  it('replaceFilenames()', () => {
    const dto = JSON.stringify({
      image: 'name2.png',
      body: '<img src="name.png"/>'
    });
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
});
