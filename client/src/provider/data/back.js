import { stringify } from 'query-string';
import { fetchUtils } from 'react-admin';

const API_URL = '/api';

export default ({ authProvider: { getToken } }) => {
  const httpClient = (url, options = {}) =>
    Promise.all([getToken()])
      .then(([token]) => ({
        ...options,
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
        `${API_URL}/${resource}?${stringify(query)}`,
        options
      ).then(({ json: { content, page } }) => ({
        data: content,
        total: page.totalElements
      }));
    },
    getOne: (resource, { id, options }) =>
      httpClient(`${API_URL}/${resource}/${id}`, options).then(({ json }) => ({
        data: json
      })),
    getMany: (resource, { ids, options }) =>
      httpClient(`${API_URL}/${resource}?${stringify({ ids })}`, options).then(
        ({ json }) => ({
          data: json
        })
      ),
    create: (resource, { data, options }) =>
      httpClient(`${API_URL}/${resource}`, {
        method: 'POST',
        body: data,
        ...options
      }).then(({ json }) => ({
        data: json
      })),
    update: (resource, { id, data, options }) =>
      httpClient(`${API_URL}/${resource}/${id}`, {
        method: 'PUT',
        body: data,
        ...options
      }).then(({ json }) => ({
        data: json
      })),
    getContent: (resource, { name, params, options }) => {
      const s = stringify(params);
      return httpClient(
        `${API_URL}/${resource}/content/${name}${s ? `?${s}` : ''}`,
        options
      ).then(({ json }) => ({
        data: json
      }));
    },
    getComponent: (resource, { name, options }) =>
      httpClient(`${API_URL}/${resource}/component/${name}`, options).then(
        ({ body }) => ({
          data: body
        })
      ),
    getConfig: (resource, { name, options }) =>
      httpClient(`${API_URL}/${resource}/config/${name}`, options).then(
        ({ json }) => ({
          data: json
        })
      ),
    getResources: ({ options }) =>
      httpClient(API_URL, options).then(({ json }) => ({
        data: json
      }))
  };
};
