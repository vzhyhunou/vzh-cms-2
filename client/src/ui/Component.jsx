import React from 'react';

import Parser from './Parser';
import useGetComponent from '../provider/data/useGetComponent';

const Component = ({ resource, name, ...props }) => {
  const { data, isLoading, error } = useGetComponent(resource, { name });

  if (isLoading) {
    return null;
  }

  if (error && error.status === 404) {
    return <Component resource="page" name="one" id="none" />;
  }

  return <Parser jsx={data} bindings={{ props }} />;
};

export default Component;
