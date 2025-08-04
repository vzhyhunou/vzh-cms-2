import { useState, useEffect } from 'react';

import { useContextProvider } from '../../Context';

export default () => {
  const {
    dataProvider: { getResources }
  } = useContextProvider();
  const [data, setData] = useState();

  useEffect(() => {
    getResources({}).then(({ data }) => setData(data));
  }, [getResources]);

  return data;
};
