import React from 'react';

import useGetContent from '../provider/data/useGetContent';
import Component from './Component';

export default ({ resource, name, children, ...params }) => {
  const props = { name, params };
  const { data, isLoading, error } = useGetContent(resource, props);

  if (isLoading) {
    return null;
  }

  if (error && error.status === 404) {
    return <Component resource="page" name="one" id="none" />;
  }

  return Array.isArray(data) ? data.map((i) => children(i)) : children(data);
};
