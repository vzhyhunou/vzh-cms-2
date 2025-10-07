import React, { createContext, useEffect, useState, useContext } from 'react';

import { useProviders } from './ProvidersContext';

const Context = createContext();
const events = [
  'before.create',
  'after.create',
  'before.update',
  'after.update',
  'before.remove',
  'after.remove'
];

export default ({ children }) => {
  const [state, setState] = useState();
  const providers = useProviders();

  if (!providers) {
    return null;
  }

  const {
    dataProvider: { getResources }
  } = providers;

  useEffect(() => {
    getResources({ type: 'settings' }).then(({ data: settings }) =>
      setState(settings)
    );
  }, [getResources]);

  if (!state) {
    return null;
  }

  return (
    <Context.Provider value={{ ...state, schema: { events, ...state.schema } }}>
      {children}
    </Context.Provider>
  );
};

export const useSettings = () => useContext(Context);
