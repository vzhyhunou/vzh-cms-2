import * as react from 'react';
import * as router from 'react-router-dom';
import * as form from 'react-hook-form';
import * as admin from 'react-admin';
import * as mui from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';

import ui from '.';

export default (({ default: React, ...react }) => ({
  React,
  ...react,
  ...admin,
  ...mui,
  ...router,
  ...form,
  ...ui,
  CodeMirror,
  javascript,
  EditorView,
  oneDark
}))(react);
