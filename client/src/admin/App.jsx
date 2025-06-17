import React, { useState, useEffect } from 'react';
import { Admin, CustomRoutes, Resource, Layout } from 'react-admin';
import { Route } from 'react-router-dom';

import { useContextProvider } from '../Context';
import Parser from './Parser';

const SCHEMA = 'schema';

export default ({ children }) => {
  const { dataProvider } = useContextProvider();
  const { getList } = dataProvider;
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
    <Admin basename="/admin" {...{ dataProvider }}>
      {() => {
        const access = Object.entries(resources).map(([k, v]) => [
          k,
          <Resource key={k} name={k} {...v} />
        ]);
        return (
          <>
            <CustomRoutes noLayout>
              <Route path="admin">
                <Route path="" element={<Layout />} />
                {access.map(([k, v]) => (
                  <Route
                    key={k}
                    path={`${k}/*`}
                    element={<Layout>{v}</Layout>}
                  />
                ))}
              </Route>
              {children}
            </CustomRoutes>
            {access.map(([k, v]) => v)}
          </>
        );
      }}
    </Admin>
  );
};
