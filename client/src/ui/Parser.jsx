import React from 'react';
import JsxParser from 'react-jsx-parser';
import Icon from '@mui/icons-material/Menu';

import b from './bindings';
import c from './components';

const Parser = ({ jsx, bindings, components }) => {
  return (
    <JsxParser
      bindings={{ ...b, ...bindings }}
      components={{ ...c, ...components, Parser, Icon }}
      jsx={jsx.replaceAll(/\n\s*/g, '')}
      renderInWrapper={false}
      autoCloseVoidElements={true}
      showWarnings={true}
    />
  );
};

export default Parser;
