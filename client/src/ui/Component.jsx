import React from 'react';

import Parser, { AdminParser } from './Parser';
import useGetComponent from '../data/useGetComponent';

const Component = ({ resource, name, ...props }) => {
  const { data, isLoading, error } = useGetComponent(resource, { name });

  if (isLoading) {
    return null;
  }

  if (error && error.status === 404) {
    return <Component resource="page" name="One" id="none" />;
  }

  return <Parser code={data} bindings={{ props }} />;
};

export const AdminComponent = ({ resource, name, ...props }) => {
  const { data, isLoading, error } = useGetComponent(resource, { name });

  if (isLoading) {
    return null;
  }

  if (error && error.status === 404) {
    return <Component resource="page" name="One" id="none" />;
  }

  return <AdminParser code={data} bindings={{ props }} />;
};

export default Component;
