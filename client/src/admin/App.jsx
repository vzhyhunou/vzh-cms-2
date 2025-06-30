import React, { useState, useEffect } from 'react';
import { Admin, CustomRoutes, Resource, Layout } from 'react-admin';
import { Route } from 'react-router-dom';

import { useContextProvider } from '../Context';
import Parser from './ui/Parser';

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

  const resources = data.map(({ id, list, create, edit }) => ({
    id,
    ...Object.fromEntries(
      Object.entries({ list, create, edit }).map(([k, v]) => [
        k,
        <Parser jsx={v} />
      ])
    )
  }));

  return (
    <Admin basename="/admin" {...{ dataProvider }}>
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
