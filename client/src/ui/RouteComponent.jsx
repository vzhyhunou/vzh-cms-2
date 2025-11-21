import React from 'react';
import { useParams } from 'react-router-dom';

import Component from './Component';

export default (props) => {
  const params = useParams();

  return <Component {...{ ...params, ...props }} />;
};
