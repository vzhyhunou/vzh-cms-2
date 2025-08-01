import * as mui from '@mui/material';
import * as router from 'react-router-dom';

import Content from './Content';
import Component from './Component';
import Transform from './Transform';
import TransformField from './TransformField';
import TransformInput from './TransformInput';

export default {
  ...mui,
  Content,
  Component,
  Transform,
  TransformField,
  TransformInput,
  ...router
};
