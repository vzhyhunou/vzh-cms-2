import * as mui from '@mui/material';
import * as router from 'react-router-dom';

import Content from './Content';
import ContentField from './ContentField';
import Component from './Component';
import Transform from './Transform';
import TransformField from './TransformField';
import TransformInput from './TransformInput';

export default {
  ...mui,
  Content,
  ContentField,
  Component,
  Transform,
  TransformField,
  TransformInput,
  ...router
};
