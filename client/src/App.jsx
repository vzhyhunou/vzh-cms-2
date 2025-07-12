import React from 'react';
import { Route } from 'react-router-dom';

import Context from './Context';
import Admin from './Admin';
import Component from './ui/Component';

export default ({ config }) => (
  <Context {...config}>
    <Admin>
      <Route element={<Component resource="page" name="one" id="layout" />}>
        <Route
          path=""
          element={<Component resource="page" name="one" id="home" />}
        />
        <Route path=":resource/:id" element={<Component name="one" />} />
        <Route path=":id" element={<Component resource="page" name="one" />} />
        <Route
          path="*"
          element={<Component resource="page" name="one" id="none" />}
        />
      </Route>
    </Admin>
  </Context>
);
