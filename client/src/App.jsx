import React, { useState, useEffect } from 'react';

import Context, { useContextProvider } from './Context';
import Core from './Core';
import Parser from './admin/Parser';

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
        list: <Parser content={list} />,
        edit: <Parser content={edit} />
      }))
      .map(({ id, list, edit }) => [id, { list, edit }])
  );

  return <Core {...{ resources }}></Core>;
};

export default ({ config }) => (
  <Context {...config}>
    <App />
  </Context>
);
