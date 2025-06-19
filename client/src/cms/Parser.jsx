import React from 'react';
import JsxParser from 'react-jsx-parser';
import { Outlet, Link } from 'react-router-dom';
import * as mui from '@mui/material';
import Icon from '@mui/icons-material/Menu';

import Component from './Component';
import * as ui from './ui';

const Parser = ({ jsx, bindings }) => {
  return (
    <JsxParser
      {...{ bindings }}
      components={{ Parser, Component, Outlet, ...mui, Link, Icon, ...ui }}
      jsx={jsx.replaceAll(/\n\s*/g, '')}
      renderInWrapper={false}
      autoCloseVoidElements={true}
      showWarnings={true}
    />
  );
};

export default Parser;
