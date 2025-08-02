import React from 'react';
import { Route, useParams } from 'react-router-dom';

import Context from './Context';
import Admin from './Admin';
import Component from './ui/Component';

const C = (props) => {
  const { '*': extra, ...p } = useParams();
  return <Component {...{ ...p, ...props }} />;
};

export default ({ config }) => (
  <Context {...config}>
    <Admin>
      <Route element={<C resource="page" name="one" id="layout" />}>
        <Route path="" element={<C resource="page" name="one" id="home" />} />
        <Route path=":resource/:id" element={<C name="one" />} />
        <Route path=":id" element={<C resource="page" name="one" />} />
        <Route path="*" element={<C resource="page" name="one" id="none" />} />
      </Route>
    </Admin>
  </Context>
);
