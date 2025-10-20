import { useEffect, useState, useCallback } from 'react';

import { useProviders } from '../context/ProvidersContext';

export default () => {
  const [messages, setMessages] = useState();
  const providers = useProviders();

  if (!providers) {
    return {};
  }

  const {
    dataProvider: { getMessages }
  } = providers;
  const get = useCallback(
    () => getMessages({}).then(({ data }) => data),
    [getMessages]
  );

  useEffect(() => {
    get().then(setMessages);
  }, [get]);

  return { messages, getMessages: get };
};
