import React from 'react';
import { useParams } from 'react-router-dom';

import Parser from './Parser';
import useGetComponent from '../provider/data/useGetComponent';

const Component = ({ resource, name, ...rest }) => {
  const { '*': extra, resource: r, ...p } = useParams();
  const params = { ...p, ...rest };
  const { data, isLoading, error } = useGetComponent(resource || r, { name });

  if (isLoading) {
    return null;
  }

  if (error && error.status === 404) {
    return <Component resource="page" name="one" id="none" />;
  }

  return <Parser jsx={data} bindings={{ params }} />;
};

export default Component;
