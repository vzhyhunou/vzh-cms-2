import React from 'react';

import useGetContent from '../data/useGetContent';
import Component from './Component';

export default ({ resource, name, children, ...params }) => {
  const props = { name, params };
  const { data, isLoading, error } = useGetContent(resource, props);

  if (isLoading) {
    return null;
  }

  if (error && error.status === 404) {
    return <Component schema="page" name="One" id="none" />;
  }

  return children(data);
};
