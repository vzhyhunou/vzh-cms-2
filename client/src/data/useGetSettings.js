import { useEffect, useState } from 'react';

import { useProviders } from '../context/ProvidersContext';

export default () => {
  const [settings, setSettings] = useState();
  const providers = useProviders();

  if (!providers) {
    return null;
  }

  const {
    dataProvider: { getResources }
  } = providers;

  useEffect(() => {
    getResources({ type: 'settings' }).then(({ data }) => setSettings(data));
  }, [getResources]);

  return settings;
};
