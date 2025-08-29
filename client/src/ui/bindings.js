import * as react from 'react';
import * as router from 'react-router-dom';
import * as form from 'react-hook-form';
import * as admin from 'react-admin';
import * as mui from '@mui/material';

import Content from './Content';
import Component from './Component';

const filter = (obj, pattern) =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([k]) => pattern.test(k))
      .map(([k, v]) => [k, v])
  );

export default (({ default: React, ...react }) => ({
  React,
  ...react,
  ...filter(admin, /^[a-z]/),
  ...mui,
  ...router,
  ...filter(form, /^use.*/),
  Content,
  Component
}))(react);
