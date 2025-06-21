import React from 'react';
import JsxParser from 'react-jsx-parser';
import * as router from 'react-router-dom';
import * as mui from '@mui/material';
import Icon from '@mui/icons-material/Menu';

import * as ui from '.';

export default ({ jsx, bindings, components }) => {
  return (
    <JsxParser
      {...{ bindings }}
      components={{ ...mui, ...ui, ...router, ...components, Icon }}
      jsx={jsx.replaceAll(/\n\s*/g, '')}
      renderInWrapper={false}
      autoCloseVoidElements={true}
      showWarnings={true}
    />
  );
};
