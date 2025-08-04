import { useState, useEffect } from 'react';

import { useContextProvider } from '../../Context';

export default () => {
  const {
    dataProvider: { getAdminComponents }
  } = useContextProvider();
  const [data, setData] = useState();

  useEffect(() => {
    getAdminComponents({}).then(({ data }) => setData(data));
  }, [getAdminComponents]);

  return data;
};
