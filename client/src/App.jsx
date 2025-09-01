import React, { useEffect, useState } from 'react';
import { Admin, CustomRoutes, Resource, Layout } from 'react-admin';
import { Route } from 'react-router-dom';

import Context, { useContextProvider } from './Context';
import Parser, { AdminParser } from './ui/Parser';
import addUploadFeature from './data/upload';
import parse from './ui/parse';

const App = () => {
  const [routes, setRoutes] = useState();
  const contextProvider = useContextProvider();
  const {
    dataProvider: { getResources, getComponent },
    authProvider
  } = contextProvider;

  useEffect(() => {
    getComponent('schema', { name: 'Routes' }).then(({ data }) =>
      setRoutes(data)
    );
  }, [getComponent]);

  if (!routes) {
    return null;
  }

  return (
    <Admin
      basename="/admin"
      dataProvider={addUploadFeature(contextProvider)}
      authProvider={authProvider}
    >
      {() =>
        getResources({}).then(({ data }) => {
          const resources = data
            .map(({ id, List, Create, Edit }) => ({
              id,
              ...Object.fromEntries(
                Object.entries({ list: List, create: Create, edit: Edit }).map(
                  ([k, v]) => [k, <AdminParser code={v} />]
                )
              )
            }))
            .map(({ id, ...rest }) => ({
              id,
              resource: <Resource key={id} name={id} {...rest} />
            }));
          return (
            <>
              <CustomRoutes noLayout>
                <Route path="admin">
                  <Route path="" element={<Layout />} />
                  {resources.map(({ id, resource }) => (
                    <Route
                      key={id}
                      path={`${id}/*`}
                      element={<Layout>{resource}</Layout>}
                    />
                  ))}
                </Route>
                {parse(routes, { Parser })}
              </CustomRoutes>
              {resources.map(({ resource }) => resource)}
            </>
          );
        })
      }
    </Admin>
  );
};

export default ({ config }) => (
  <Context {...config}>
    <App />
  </Context>
);
