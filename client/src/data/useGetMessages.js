import { useEffect, useState, useCallback } from 'react';

import { useProviders } from '../context/ProvidersContext';

export default () => {
  const [messages, setMessages] = useState();
  const providers = useProviders();

  if (!providers) {
    return {};
  }

  const {
    dataProvider: { getResources }
  } = providers;
  const getMessages = useCallback(
    () => getResources({ type: 'messages' }).then(({ data }) => data),
    [getResources]
  );

  useEffect(() => {
    getMessages().then(setMessages);
  }, [getMessages]);

  return { messages, getMessages };
};
