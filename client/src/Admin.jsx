import React, { useState, useEffect } from 'react';
import { Admin, CustomRoutes, Resource, Layout } from 'react-admin';
import { Route } from 'react-router-dom';
import * as admin from 'react-admin';

import { useContextProvider } from './Context';
import Parser from './ui/Parser';
import addUploadFeature from './provider/data/upload';

const SCHEMA = 'schema';

export default ({ children }) => {
  const contextProvider = useContextProvider();
  const {
    dataProvider: { getList }
  } = contextProvider;
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

  const resources = data
    .filter(({ list }) => list)
    .map(({ id, list, create, edit }) => ({
      id,
      ...Object.fromEntries(
        Object.entries({ list, create, edit }).map(([k, v]) => [
          k,
          <Parser jsx={v} components={{ ...admin }} />
        ])
      )
    }));

  return (
    <Admin basename="/admin" dataProvider={addUploadFeature(contextProvider)}>
      {() => {
        const access = resources.map(({ id, ...rest }) => ({
          id,
          resource: <Resource key={id} name={id} {...rest} />
        }));
        return (
          <>
            <CustomRoutes noLayout>
              <Route path="admin">
                <Route path="" element={<Layout />} />
                {access.map(({ id, resource }) => (
                  <Route
                    key={id}
                    path={`${id}/*`}
                    element={<Layout>{resource}</Layout>}
                  />
                ))}
              </Route>
              {children}
            </CustomRoutes>
            {access.map(({ resource }) => resource)}
          </>
        );
      }}
    </Admin>
  );
};
