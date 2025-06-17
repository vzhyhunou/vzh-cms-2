import React from 'react';
import JsxParser from 'react-jsx-parser';

import Component from './Component';

const Parser = ({ jsx, bindings }) => {
  return (
    <JsxParser
      {...{ bindings }}
      components={{ Parser, Component }}
      jsx={jsx.replaceAll(/\n\s*/g, '')}
      renderInWrapper={false}
      autoCloseVoidElements={true}
      showWarnings={true}
    />
  );
};

export default Parser;
