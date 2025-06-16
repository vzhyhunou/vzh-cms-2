import React from 'react';
import { useParams } from 'react-router-dom';

import Parser from './Parser';
import useGetComponent from './useGetComponent';

const Component = ({ resource, name, titled, ...rest }) => {
  const { '*': extra, resource: r, ...p } = useParams();
  const props = { name, params: { ...p, ...rest } };
  const { data, isLoading, error } = useGetComponent(resource || r, props);

  if (isLoading) {
    return null;
  }

  if (error && error.status === 404) {
    return <Component resource="page" name="one" id="none" {...{ titled }} />;
  }

  const { content, element, title } = data;

  if (titled) {
    // eslint-disable-next-line no-new-func
    document.title = new Function('content', `return ${title}`)(content);
  }

  return <Parser jsx={element} bindings={{ content }} />;
};

export default Component;
