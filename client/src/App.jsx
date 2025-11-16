import React from 'react';
import { Admin, CustomRoutes, Resource, Layout } from 'react-admin';
import { Route, Navigate } from 'react-router-dom';

import ProvidersContext, { useProviders } from './context/ProvidersContext';
import SettingsContext from './context/SettingsContext';
import Parser, { AdminParser } from './ui/Parser';
import addUploadFeature from './data/upload';
import parse from './ui/parse';
import useGetRoutes from './data/useGetRoutes';
import useGetLocale from './locale/useGetLocale';
import useGetMessages from './data/useGetMessages';
import i18nProvider from './i18n/polyglot';
import { useSettings } from './context/SettingsContext';

const App = () => {
  const routes = useGetRoutes();
  const providers = useProviders();
  const { locales, locale } = useGetLocale();
  const { messages, getMessages } = useGetMessages();
  const settings = useSettings();

  if (!routes || !providers || !locales || !messages || !settings) {
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
      i18nProvider={i18nProvider(
        providers,
        locales,
        locale,
        messages,
        getMessages
      )}
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

export default ({ config }) => (
  <ProvidersContext {...config}>
    <SettingsContext>
      <App />
    </SettingsContext>
  </ProvidersContext>
);
