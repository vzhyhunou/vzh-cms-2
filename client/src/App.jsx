import React from 'react';
import { Admin, CustomRoutes, Resource, Layout } from 'react-admin';
import { Route, Navigate } from 'react-router-dom';

import ProvidersContext, { useProviders } from './context/ProvidersContext';
import SettingsContext from './context/SettingsContext';
import Parser, { AdminParser } from './ui/Parser';
import addUploadFeature from './data/upload';
import parse from './ui/parse';
import useGetRoutes from './data/useGetRoutes';
import useGetI18n from './i18n/useGetI18n';
import i18nProvider from './i18n/polyglot';
import { useSettings } from './context/SettingsContext';

const App = () => {
  const routes = useGetRoutes();
  const providers = useProviders();
  const i18n = useGetI18n();
  const settings = useSettings();

  if (!routes || !providers || !i18n || !settings) {
    return null;
  }

  const {
    dataProvider: { getResources },
    authProvider
  } = providers;

  return (
    <Admin
      basename="/admin"
      dataProvider={addUploadFeature(providers)}
      i18nProvider={i18nProvider(providers, i18n)}
      authProvider={authProvider}
    >
      {() =>
        getResources({}).then(({ data }) => {
          const resources = data
            .map(({ id, List, Create, Edit, Icon }) => ({
              id,
              ...Object.fromEntries(
                Object.entries({ list: List, create: Create, edit: Edit })
                  .filter(([k, v]) => v)
                  .map(([k, v]) => [k, <AdminParser code={v} />])
              ),
              icon: Icon && (() => <AdminParser code={Icon} />)
            }))
            .map(({ id, ...rest }) => ({
              id,
              resource: <Resource key={id} name={id} {...rest} />
            }));
          return (
            <>
              <CustomRoutes noLayout>
                <Route path="admin">
                  {resources.length ? (
                    <>
                      <Route path="" element={<Layout />} />
                      {resources.map(({ id, resource }) => (
                        <Route
                          key={id}
                          path={`${id}/*`}
                          element={<Layout>{resource}</Layout>}
                        />
                      ))}
                    </>
                  ) : (
                    <Route path="*?" element={<Navigate to="/login" />} />
                  )}
                </Route>
                {parse(routes, { Parser, settings })}
              </CustomRoutes>
              {resources.map(({ resource }) => resource)}
            </>
          );
        })
      }
    </Admin>
  );
};

export default (props) => (
  <ProvidersContext {...props}>
    <SettingsContext>
      <App />
    </SettingsContext>
  </ProvidersContext>
);
