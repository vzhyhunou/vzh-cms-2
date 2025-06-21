import { createContext, useState, useContext } from 'react';

const Context = createContext();

export default ({ value, children }) => {
  const [state, setState] = useState(value);

  return (
    <Context.Provider value={setState}>{children(state)}</Context.Provider>
  );
};

export const useSetState = () => useContext(Context);
