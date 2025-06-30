import React from 'react';
import * as admin from 'react-admin';

import Transform from './Transform';

export default ({ children, ...rest }) => (
  <Transform {...rest} components={admin}>
    {children}
  </Transform>
);
