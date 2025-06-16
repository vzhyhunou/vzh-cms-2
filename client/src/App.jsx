import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

import Context, { useContextProvider } from './Context';
import Core from './Core';
import Parser from './admin/Parser';
import Component from './cms/Component';

const SCHEMA = 'schema';

const App = () => {
  const {
    dataProvider: { getList }
  } = useContextProvider();
  const [data, setData] = useState();

  useEffect(() => {
    getList(SCHEMA, {
      pagination: { page: 1, perPage: Number.MAX_SAFE_INTEGER },
      sort: { field: 'id', order: 'ASC' }
    }).then(({ data }) => setData(data));
  }, [getList]);

  if (!data) {
    return;
  }

  const resources = Object.fromEntries(
    data
      .map(({ id, list, edit }) => ({
        id,
        list: <Parser jsx={list} />,
        edit: <Parser jsx={edit} />
      }))
      .map(({ id, list, edit }) => [id, { list, edit }])
  );

  return (
    <Core {...{ resources }}>
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
    </Core>
  );
};

export default ({ config }) => (
  <Context {...config}>
    <App />
  </Context>
);
