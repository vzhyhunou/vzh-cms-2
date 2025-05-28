import { stringify } from 'query-string';
import { fetchUtils } from 'react-admin';

const API_URL = '/api';

export default () => {
  const httpClient = (url, options = {}) => fetchUtils.fetchJson(url, options);

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
    }
  };
};
