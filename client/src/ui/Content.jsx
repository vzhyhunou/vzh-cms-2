import React from 'react';

import useGetContent from '../data/useGetContent';
import None from './None';

export default ({ resource, name, children, ...params }) => {
  const props = { name, params };
  const { data, isLoading, error } = useGetContent(resource, props);

  if (isLoading) {
    return null;
  }

  if (error && error.status === 404) {
    return <None />;
  }

  return children(data);
};
