import React, { createContext, useEffect, useState, useContext } from 'react';

const Context = createContext();

export default ({ provider, children, ...rest }) => {
  const [state, setState] = useState();
  const config = JSON.stringify(rest);

  useEffect(() => {
    provider.then(({ default: _ }) => _(JSON.parse(config))).then(setState);
  }, [provider, config]);

  if (!state) {
    return null;
  }

  return <Context.Provider value={state}>{children}</Context.Provider>;
};

export const useProviders = () => useContext(Context);
