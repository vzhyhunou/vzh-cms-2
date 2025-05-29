import React from 'react';
import JsxParser from 'react-jsx-parser';
import * as admin from 'react-admin';

import * as ui from '../admin';

export default ({ content }) => {
  return (
    <JsxParser
      bindings={{ ...admin }}
      components={{ ...admin, ...ui }}
      jsx={content}
      renderInWrapper={false}
      autoCloseVoidElements={true}
      showWarnings={true}
    />
  );
};
