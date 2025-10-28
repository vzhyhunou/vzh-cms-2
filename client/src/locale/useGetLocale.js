import { useState, useEffect } from 'react';

import { useProviders } from '../context/ProvidersContext';
import { useSettings } from '../context/SettingsContext';

export default () => {
  const [state, setState] = useState();
  const providers = useProviders();
  const settings = useSettings();

  if (!providers || !settings) {
    return {};
  }

  const {
    localeProvider: { getLocale, setLocale }
  } = providers;
  const {
    schema: { locales }
  } = settings;

  useEffect(() => {
    getLocale()
      .then(async (data) => {
        if (data) {
          return data;
        }
        const l = Object.keys(locales)[0];
        await setLocale(l);
        return l;
      })
      .then(setState);
  }, [getLocale, setLocale, locales]);

  return { locale: state, locales };
};
