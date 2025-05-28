import React from 'react';
import JsxParser from 'react-jsx-parser';
import * as admin from 'react-admin';

export default ({ content }) => {
  return (
    <JsxParser
      components={{ ...admin }}
      jsx={content}
      renderInWrapper={false}
      autoCloseVoidElements={true}
      showWarnings={true}
    />
  );
};
