import React from 'react';
import { Route } from 'react-router-dom';

import Context from './Context';
import Admin from './admin/App';
import Component from './ui/Component';

export default ({ config }) => (
  <Context {...config}>
    <Admin>
      <Route element={<Component resource="page" name="one" id="layout" />}>
        <Route
          path=""
          element={<Component resource="page" name="one" id="home" titled />}
        />
        <Route path=":resource/:id" element={<Component name="one" titled />} />
        <Route
          path=":id"
          element={<Component resource="page" name="one" titled />}
        />
        <Route
          path="*"
          element={<Component resource="page" name="one" id="none" titled />}
        />
      </Route>
    </Admin>
  </Context>
);
