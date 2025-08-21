import * as r from 'react';
import * as router from 'react-router-dom';
import * as form from 'react-hook-form';
import * as admin from 'react-admin';

export default (({ default: extra, ...r }) => ({
  ...r,
  ...router,
  ...form,
  ...admin
}))(r);
