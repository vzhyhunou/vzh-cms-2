import React from 'react';
import * as admin from 'react-admin';

import Parser from '../../ui/Parser';
import * as ui from '.';

export default (props) => (
  <Parser {...props} bindings={{ ...admin }} components={{ ...ui, ...admin }} />
);
