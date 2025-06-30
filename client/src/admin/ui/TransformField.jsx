import React from 'react';
import * as admin from 'react-admin';

import Transform from '../../ui/Transform';
import * as ui from '.';

export default ({ children, ...rest }) => (
  <Transform {...rest} components={{ ...ui, ...admin }}>
    {children}
  </Transform>
);
