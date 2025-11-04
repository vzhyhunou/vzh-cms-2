import md5 from 'js-md5';

const STATIC = 'static';
const log = (type, args, response) => {
  if (console.group) {
    console.groupCollapsed(type, JSON.stringify(args));
    console.log(response);
    console.groupEnd();
  } else {
    console.log('FakeRest request ', type, args);
    console.log('FakeRest response', response);
  }
};
const processFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })
    .then((picture64) => ({
      value: picture64.match(/,(.*)/)[1],
      type: picture64.match(/\/(.*);/)[1]
    }))
    .then(({ value, type }) => ({
      value,
      id: `${md5(value)}.${type}`
    }));

export default ({
  schemasService,
  storageService: { replaceFilenames },
  localeProvider: { getLocale },
  authProvider: { getPermissions, getIdentity }
}) => {
  const handle =
    (type, fn) =>
    async (...args) => {
      const locale = await getLocale();
      const permissions = await getPermissions();
      const { id } = await getIdentity();
      const data = await fn(...args, { locale, permissions, username: id });
      log(type, args, data);
      return data;
    };
  const save = (resource, { data }, { username }) =>
    Promise.all(
      data
        .getAll('files')
        .map((file) =>
          processFile(file).then((item) =>
            schemasService
              .save(STATIC, item)
              .then(({ id }) => ({ originalname: file.name, filename: id }))
          )
        )
    )
      .then((files) => replaceFilenames(data.get('dto'), files))
      .then((data) =>
        schemasService.save(resource, data, {
          request: { user: { username } }
        })
      )
      .then((data) => ({ data }));

  return {
    getList: handle('getList', (resource, { pagination, sort, filter }) => {
      const { page, perPage } = pagination;
      const { field, order } = sort;
      const query = {
        page: page - 1,
        size: perPage,
        sort: { [field]: order },
        ...filter
      };
      return schemasService
        .findAll(resource, query)
        .then(({ content, page }) => ({
          data: content,
          total: page.totalElements
        }));
    }),
    getOne: handle('getOne', (resource, { id }) =>
      schemasService.findById(resource, id).then((data) => ({ data }))
    ),
    getMany: handle('getMany', (resource, { ids }) =>
      schemasService.findByIdIn(resource, ids).then((data) => ({ data }))
    ),
    create: handle('create', save),
    update: handle('update', save),
    delete: handle('delete', (resource, { id }) =>
      schemasService.remove(resource, id)
    ),
    getContent: handle('getContent', (resource, { name, params }, { locale }) =>
      schemasService
        .findContent(resource, name, {
          request: { query: params },
          system: { locale }
        })
        .then((data) => ({ data }))
    ),
    getComponent: handle('getComponent', (resource, { name }) =>
      schemasService.findComponent(resource, name).then((data) => ({ data }))
    ),
    getResources: handle('getResources', (params, { permissions = [] }) =>
      schemasService.findResources(permissions).then((data) => ({ data }))
    ),
    getSettings: handle('getSettings', () =>
      schemasService.findSettings().then((data) => ({ data }))
    ),
    getMessages: handle('getMessages', (params, { locale }) =>
      schemasService.findMessages(locale).then((data) => ({ data }))
    )
  };
};
