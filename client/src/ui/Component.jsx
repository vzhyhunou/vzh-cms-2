import React from 'react';

import Parser, { AdminParser } from './Parser';
import useGetComponent from '../data/useGetComponent';

const Component = ({ schema, name, ...props }) => {
  const { data, isLoading, error } = useGetComponent(schema, { name });

  if (isLoading) {
    return null;
  }

  if (error && error.status === 404) {
    return <Component schema="page" name="One" id="none" />;
  }

  return <Parser code={data} bindings={{ props }} />;
};

export const AdminComponent = ({ schema, name, ...props }) => {
  const { data, isLoading, error } = useGetComponent(schema, { name });

  if (isLoading) {
    return null;
  }

  if (error && error.status === 404) {
    return <Component schema="page" name="One" id="none" />;
  }

  return <AdminParser code={data} bindings={{ props }} />;
};

export default Component;
