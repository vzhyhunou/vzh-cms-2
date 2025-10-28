import { useEffect, useState } from 'react';

import { useProviders } from '../context/ProvidersContext';

export default () => {
  const [routes, setRoutes] = useState();
  const providers = useProviders();

  if (!providers) {
    return null;
  }

  const {
    dataProvider: { getComponent }
  } = providers;

  useEffect(() => {
    getComponent('schema', { name: 'Routes' }).then(({ data }) =>
      setRoutes(data)
    );
  }, [getComponent]);

  return routes;
};
