import { useEffect, useState } from 'react';

import { useProviders } from '../context/ProvidersContext';

export default () => {
  const [settings, setSettings] = useState();
  const providers = useProviders();

  if (!providers) {
    return null;
  }

  const {
    dataProvider: { getSettings }
  } = providers;

  useEffect(() => {
    getSettings({}).then(({ data }) => setSettings(data));
  }, [getSettings]);

  return settings;
};
