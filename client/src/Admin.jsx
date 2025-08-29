import React from 'react';
import { Admin, CustomRoutes, Resource, Layout } from 'react-admin';
import { Route } from 'react-router-dom';

import { useContextProvider } from './Context';
import { AdminParser } from './ui/Parser';
import addUploadFeature from './provider/data/upload';

export default ({ children }) => {
  const contextProvider = useContextProvider();
  const dataProvider = addUploadFeature(contextProvider);
  const {
    authProvider,
    settings: {
      schema: { route }
    }
  } = contextProvider;
  const { getResources } = dataProvider;

  return (
    <Admin basename="/admin" {...{ dataProvider, authProvider }}>
      {() =>
        getResources({}).then(({ data }) => {
          const resources = data
            .filter(({ list }) => list)
            .map(({ id, list, create, edit }) => ({
              id,
              ...Object.fromEntries(
                Object.entries({ list, create, edit }).map(([k, v]) => [
                  k,
                  <AdminParser code={v} />
                ])
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
                {children(route)}
              </CustomRoutes>
              {resources.map(({ resource }) => resource)}
            </>
          );
        })
      }
    </Admin>
  );
};
