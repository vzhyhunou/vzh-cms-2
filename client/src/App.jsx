import React from 'react';
import { Admin, CustomRoutes, Resource, Layout } from 'react-admin';
import { Route } from 'react-router-dom';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import ProvidersContext, { useProviders } from './context/ProvidersContext';
import SettingsContext from './context/SettingsContext';
import Parser, { AdminParser } from './ui/Parser';
import addUploadFeature from './data/upload';
import parse from './ui/parse';
import useGetRoutes from './data/useGetRoutes';
import useGetLocale from './locale/useGetLocale';
import useGetMessages from './data/useGetMessages';

const App = () => {
  const routes = useGetRoutes();
  const providers = useProviders();
  const { locales, locale } = useGetLocale();
  let { messages, getMessages } = useGetMessages();

  if (!routes || !providers || !locales || !messages) {
    return null;
  }

  const {
    localeProvider: { setLocale },
    dataProvider: { getResources },
    authProvider
  } = providers;
  const i18nProvider = polyglotI18nProvider(
    (value) => {
      if (messages) {
        try {
          return messages;
        } finally {
          messages = undefined;
        }
      }
      return setLocale(value).then(getMessages);
    },
    locale,
    Object.entries(locales).map(([key, value]) => ({
      locale: key,
      name: value
    }))
  );

  return (
    <Admin
      basename="/admin"
      dataProvider={addUploadFeature(providers)}
      i18nProvider={i18nProvider}
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
  <ProvidersContext {...config}>
    <SettingsContext>
      <App />
    </SettingsContext>
  </ProvidersContext>
);
