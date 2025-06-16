import React from 'react';
import JsxParser from 'react-jsx-parser';

import Component from './Component';

export default ({ jsx, bindings }) => {
  return (
    <JsxParser
      {...{ bindings }}
      components={{ Component }}
      jsx={jsx.replaceAll(/\n\s*/g, '')}
      renderInWrapper={false}
      autoCloseVoidElements={true}
      showWarnings={true}
    />
  );
};
