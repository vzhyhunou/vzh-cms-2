import React from 'react';
import JsxParser from 'react-jsx-parser';
import * as admin from 'react-admin';

export default ({ content }) => {
  return (
    <JsxParser
      bindings={{ ...admin }}
      components={{ ...admin }}
      jsx={content.replaceAll(/\n\s*/g, '')}
      renderInWrapper={false}
      autoCloseVoidElements={true}
      showWarnings={true}
    />
  );
};
