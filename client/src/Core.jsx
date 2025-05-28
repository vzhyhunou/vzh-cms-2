import React from 'react';
import { CustomRoutes, Resource, Layout } from 'react-admin';
import { Route } from 'react-router-dom';

import Admin from './admin/App';

export default ({ resources, children }) => (
  <Admin basename="/admin">
    {() => {
      const access = Object.entries(resources).map(([k, v]) => [
        k,
        <Resource key={k} name={k} {...v} />
      ]);
      return (
        <>
          <CustomRoutes noLayout>
            <Route path="admin">
              {access.map(([k, v]) => (
                <Route key={k} path={`${k}/*`} element={<Layout>{v}</Layout>} />
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
