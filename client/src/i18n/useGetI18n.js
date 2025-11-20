import { useEffect, useState } from 'react';

import { useProviders } from '../context/ProvidersContext';
import useGetLocale from './useGetLocale';

export default () => {
  const [messages, setMessages] = useState();
  const providers = useProviders();
  const params = useGetLocale();

  if (!providers) {
    return null;
  }

  const {
    dataProvider: { getMessages }
  } = providers;
  const p = JSON.stringify(params);

  useEffect(() => {
    JSON.parse(p) &&
      getMessages({})
        .then(({ data }) => data)
        .then(setMessages);
  }, [getMessages, p]);

  if (!messages) {
    return null;
  }

  return {
    messages,
    getMessages: () => getMessages({}).then(({ data }) => data),
    ...params
  };
};
