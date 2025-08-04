import addUploadFeature from './upload';

const run = async (
  method,
  {
    request = {},
    expectedRequest = {},
    expectedRequestFiles = [],
    response = {},
    expectedResponse = {}
  }
) => {
  const dataProvider = {
    [method]: (resource, { data }) => {
      const dto = data instanceof FormData ? JSON.parse(data.get('dto')) : data;
      const files =
        data instanceof FormData
          ? data.getAll('files').map(({ name }) => name)
          : [];
      expect(dto).toMatchObject(expectedRequest);
      expect(files).toMatchObject(expectedRequestFiles);
      return Promise.resolve({ data: response });
    }
  };
  const funcProvider = { originByData: (n) => `sample/${n}` };
  const provider = addUploadFeature({ dataProvider, funcProvider });
  const { data } = await provider[method](undefined, { data: request });
  expect(data).toMatchObject(expectedResponse);
};

describe('upload', () => {
  it('no files in request', () => run('create', {}));

  it('existing files in request', () =>
    run('create', {
      request: {
        image: {
          src: 'src',
          title: '900150983cd24fb0d6963f7d28e17f71.png'
        },
        images: [
          {
            src: 'src',
            title: '900150983cd24fb0d6963f7d28e17f72.png'
          }
        ],
        body: {
          en: '<img src="900150983cd24fb0d6963f7d28e17f73.png"/>'
        },
        extra: undefined,
        '@files': {
          body: {
            en: [
              {
                src: 'src',
                title: '900150983cd24fb0d6963f7d28e17f74.png'
              }
            ]
          }
        }
      },
      expectedRequest: {
        image: '900150983cd24fb0d6963f7d28e17f71.png',
        images: ['900150983cd24fb0d6963f7d28e17f72.png'],
        body: {
          en: '<img src="900150983cd24fb0d6963f7d28e17f73.png"/>'
        }
      }
    }));

  it('should modify request data', () =>
    run('create', {
      request: {
        image: {
          rawFile: new File([], 'a.png')
        },
        images: [
          {
            rawFile: new File([], 'b.png')
          }
        ],
        body: {
          en: '<img src="c.png"/>'
        },
        '@files': {
          body: {
            en: [
              {
                rawFile: new File([], 'c.png')
              }
            ]
          }
        }
      },
      expectedRequest: {
        image: 'a.png',
        images: ['b.png'],
        body: {
          en: '<img src="c.png"/>'
        }
      },
      expectedRequestFiles: ['a.png', 'b.png', 'c.png']
    }));

  it('should modify request data with existing files in request', () =>
    run('create', {
      request: {
        image: {
          rawFile: new File([], 'a.png')
        },
        body: {
          en: '<img src="900150983cd24fb0d6963f7d28e17f71.png"/><img src="b.png"/>'
        },
        '@files': {
          body: {
            en: [
              {
                src: 'src',
                title: '900150983cd24fb0d6963f7d28e17f71.png'
              },
              {
                rawFile: new File([], 'b.png')
              }
            ]
          }
        }
      },
      expectedRequest: {
        image: 'a.png',
        body: {
          en: '<img src="900150983cd24fb0d6963f7d28e17f71.png"/><img src="b.png"/>'
        }
      },
      expectedRequestFiles: ['a.png', 'b.png']
    }));

  it('should replace existing file in request', () =>
    run('create', {
      request: {
        image: {
          rawFile: new File([], 'a.png'),
          title: '2164c9abcd4088b31bbf5e7cf62f79c6.png'
        }
      },
      expectedRequest: {
        image: 'a.png'
      },
      expectedRequestFiles: ['a.png']
    }));

  it('no files in response', () => run('getOne', {}));

  it('should modify response item', () =>
    run('getOne', {
      response: {
        image: '900150983cd24fb0d6963f7d28e17f71.png',
        images: ['900150983cd24fb0d6963f7d28e17f72.png'],
        body: {
          en: '<img src="900150983cd24fb0d6963f7d28e17f73.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/>'
        }
      },
      expectedResponse: {
        image: {
          src: 'sample/900150983cd24fb0d6963f7d28e17f71.png',
          title: '900150983cd24fb0d6963f7d28e17f71.png'
        },
        images: [
          {
            src: 'sample/900150983cd24fb0d6963f7d28e17f72.png',
            title: '900150983cd24fb0d6963f7d28e17f72.png'
          }
        ],
        body: {
          en: '<img src="900150983cd24fb0d6963f7d28e17f73.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/>'
        },
        '@files': {
          body: {
            en: [
              {
                src: 'sample/900150983cd24fb0d6963f7d28e17f73.png',
                title: '900150983cd24fb0d6963f7d28e17f73.png'
              },
              {
                src: 'sample/900150983cd24fb0d6963f7d28e17f74.png',
                title: '900150983cd24fb0d6963f7d28e17f74.png'
              }
            ]
          }
        }
      }
    }));

  it('should modify response items', () =>
    run('getList', {
      response: [
        {
          image: '900150983cd24fb0d6963f7d28e17f71.png',
          images: ['900150983cd24fb0d6963f7d28e17f72.png'],
          body: {
            en: '<img src="900150983cd24fb0d6963f7d28e17f73.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/>'
          }
        }
      ],
      expectedResponse: [
        {
          image: {
            src: 'sample/900150983cd24fb0d6963f7d28e17f71.png',
            title: '900150983cd24fb0d6963f7d28e17f71.png'
          },
          images: [
            {
              src: 'sample/900150983cd24fb0d6963f7d28e17f72.png',
              title: '900150983cd24fb0d6963f7d28e17f72.png'
            }
          ],
          body: {
            en: '<img src="900150983cd24fb0d6963f7d28e17f73.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/>'
          },
          '@files': {
            body: {
              en: [
                {
                  src: 'sample/900150983cd24fb0d6963f7d28e17f73.png',
                  title: '900150983cd24fb0d6963f7d28e17f73.png'
                },
                {
                  src: 'sample/900150983cd24fb0d6963f7d28e17f74.png',
                  title: '900150983cd24fb0d6963f7d28e17f74.png'
                }
              ]
            }
          }
        }
      ]
    }));

  it('should modify response content', () =>
    run('getContent', {
      response: {
        image: '900150983cd24fb0d6963f7d28e17f71.png',
        images: ['900150983cd24fb0d6963f7d28e17f72.png'],
        body: {
          en: '<img src="900150983cd24fb0d6963f7d28e17f73.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/>'
        }
      },
      expectedResponse: {
        image: {
          src: 'sample/900150983cd24fb0d6963f7d28e17f71.png',
          title: '900150983cd24fb0d6963f7d28e17f71.png'
        },
        images: [
          {
            src: 'sample/900150983cd24fb0d6963f7d28e17f72.png',
            title: '900150983cd24fb0d6963f7d28e17f72.png'
          }
        ],
        body: {
          en: '<img src="sample/900150983cd24fb0d6963f7d28e17f73.png"/><img src="sample/900150983cd24fb0d6963f7d28e17f74.png"/><img src="sample/900150983cd24fb0d6963f7d28e17f74.png"/>'
        }
      }
    }));

  it('should modify response contents', () =>
    run('getContent', {
      response: [
        {
          image: '900150983cd24fb0d6963f7d28e17f71.png',
          images: ['900150983cd24fb0d6963f7d28e17f72.png'],
          body: {
            en: '<img src="900150983cd24fb0d6963f7d28e17f73.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/><img src="900150983cd24fb0d6963f7d28e17f74.png"/>'
          }
        }
      ],
      expectedResponse: [
        {
          image: {
            src: 'sample/900150983cd24fb0d6963f7d28e17f71.png',
            title: '900150983cd24fb0d6963f7d28e17f71.png'
          },
          images: [
            {
              src: 'sample/900150983cd24fb0d6963f7d28e17f72.png',
              title: '900150983cd24fb0d6963f7d28e17f72.png'
            }
          ],
          body: {
            en: '<img src="sample/900150983cd24fb0d6963f7d28e17f73.png"/><img src="sample/900150983cd24fb0d6963f7d28e17f74.png"/><img src="sample/900150983cd24fb0d6963f7d28e17f74.png"/>'
          }
        }
      ]
    }));
});
