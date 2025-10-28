import { stringify } from 'query-string';
import { fetchUtils } from 'react-admin';

const API_URL = '/api';

export default ({
  localeProvider: { getLocale },
  authProvider: { getToken }
}) => {
  const httpClient = (url, options = {}) =>
    Promise.all([getLocale(), getToken()])
      .then(([locale, token]) => ({
        ...options,
        headers: new Headers({
          Accept: 'application/json',
          'Accept-Language': locale
        }),
        ...(token
          ? {
              user: {
                authenticated: true,
                token: `Bearer ${token}`
              }
            }
          : {})
      }))
      .then((options) => fetchUtils.fetchJson(url, options));

  return {
    getList: (resource, { pagination, sort, filter, options }) => {
      const { page, perPage } = pagination;
      const { field, order } = sort;
      const query = {
        page: page - 1,
        size: perPage,
        sort: `${field},${order}`,
        ...filter
      };
      return httpClient(
        `${API_URL}/resource/${resource}?${stringify(query)}`,
        options
      ).then(({ json: { content, page } }) => ({
        data: content,
        total: page.totalElements
      }));
    },
    getOne: (resource, { id, options }) =>
      httpClient(`${API_URL}/resource/${resource}/${id}`, options).then(
        ({ json }) => ({
          data: json
        })
      ),
    getMany: (resource, { ids, options }) =>
      httpClient(
        `${API_URL}/resource/${resource}?${stringify({ ids })}`,
        options
      ).then(({ json }) => ({
        data: json
      })),
    create: (resource, { data, options }) =>
      httpClient(`${API_URL}/resource/${resource}`, {
        method: 'POST',
        body: data,
        ...options
      }).then(({ json }) => ({
        data: json
      })),
    update: (resource, { id, data, options }) =>
      httpClient(`${API_URL}/resource/${resource}/${id}`, {
        method: 'PUT',
        body: data,
        ...options
      }).then(({ json }) => ({
        data: json
      })),
    delete: (resource, { id, options }) =>
      httpClient(`${API_URL}/resource/${resource}/${id}`, {
        method: 'DELETE',
        ...options
      }).then(({ json }) => ({
        data: json
      })),
    getContent: (resource, { name, params, options }) => {
      const s = stringify(params);
      return httpClient(
        `${API_URL}/content/${resource}/${name}${s ? `?${s}` : ''}`,
        options
      ).then(({ json }) => ({
        data: json
      }));
    },
    getComponent: (resource, { name, options }) =>
      httpClient(`${API_URL}/component/${resource}/${name}`, options).then(
        ({ body }) => ({
          data: body
        })
      ),
    getResources: ({ options }) =>
      httpClient(`${API_URL}/admin`, options).then(({ json }) => ({
        data: json
      })),
    getSettings: ({ options }) =>
      httpClient(`${API_URL}/settings`, options).then(({ json }) => ({
        data: json
      })),
    getMessages: ({ options }) =>
      httpClient(`${API_URL}/messages`, options).then(({ json }) => ({
        data: json
      }))
  };
};
