import React, { createContext, useContext } from 'react';

import useGetSettings from '../data/useGetSettings';

const Context = createContext();

export default ({ children }) => {
  const settings = useGetSettings();

  if (!settings) {
    return null;
  }

  return (
    <Context.Provider
      value={settings}
    >
      {children}
    </Context.Provider>
  );
};

export const useSettings = () => useContext(Context);
