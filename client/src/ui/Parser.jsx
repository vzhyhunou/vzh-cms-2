import React from 'react';
import JsxParser from 'react-jsx-parser';
import Icon from '@mui/icons-material/Menu';

import dependencies from './dependencies';

const Parser = ({ jsx, bindings, components }) => {
  return (
    <JsxParser
      {...{ bindings }}
      components={{ ...dependencies, ...components, Parser, Icon }}
      jsx={jsx.replaceAll(/\n\s*/g, '')}
      renderInWrapper={false}
      autoCloseVoidElements={true}
      showWarnings={true}
    />
  );
};

export default Parser;
