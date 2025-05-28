import React from 'react';
import { Admin } from 'react-admin';

import { useContextProvider } from '../Context';

export default ({ children, ...rest }) => {
  const { dataProvider } = useContextProvider();

  return <Admin {...{ dataProvider, ...rest }}>{children}</Admin>;
};
