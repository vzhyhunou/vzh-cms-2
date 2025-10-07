import React, { createContext, useContext } from 'react';

import useGetSettings from '../data/useGetSettings';

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
  const settings = useGetSettings();

  if (!settings) {
    return null;
  }

  return (
    <Context.Provider
      value={{ ...settings, schema: { events, ...settings.schema } }}
    >
      {children}
    </Context.Provider>
  );
};

export const useSettings = () => useContext(Context);
