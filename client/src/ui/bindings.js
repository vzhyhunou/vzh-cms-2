import * as react from 'react';
import * as router from 'react-router-dom';
import * as form from 'react-hook-form';
import * as admin from 'react-admin';
import * as mui from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import {EditorView} from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';

import Content from './Content';
import Component from './Component';

export default (({ default: React, ...react }, {useTheme, ...admin}) => ({
  React,
  ...react,
  ...admin,
  ...mui,
  useTheme,
  ...router,
  ...form,
  Content,
  Component,
  CodeMirror,
  javascript,
  EditorView,
  oneDark
}))(react, admin);
