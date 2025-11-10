import * as react from 'react';
import * as router from 'react-router-dom';
import * as form from 'react-hook-form';
import * as admin from 'react-admin';
import * as mui from '@mui/material';

import * as ui from '.';

export default (({ default: React, ...react }, { default: f, ...form }) => ({
  React,
  ...react,
  ...admin,
  ...mui,
  ...router,
  ...form,
  ...ui
}))(react, form);
