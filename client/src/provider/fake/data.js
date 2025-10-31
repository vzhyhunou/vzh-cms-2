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

export default ({
  schemasService,
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
    create: handle('create', (resource, { data }, { username }) =>
      schemasService
        .save(resource, JSON.parse(data.get('dto')), {
          request: { user: { username } }
        })
        .then((data) => ({ data }))
    ),
    update: handle('update', (resource, { data }, { username }) =>
      schemasService
        .save(resource, JSON.parse(data.get('dto')), {
          request: { user: { username } }
        })
        .then((data) => ({ data }))
    ),
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
