import { useEffect, useState } from 'react';

import { useProviders } from '../context/ProvidersContext';

export default () => {
  const [routes, setRoutes] = useState();
  const {
    dataProvider: { getComponent }
  } = useProviders();

  useEffect(() => {
    getComponent('schema', { name: 'Routes' }).then(({ data }) =>
      setRoutes(data)
    );
  }, [getComponent]);

  return routes;
};
