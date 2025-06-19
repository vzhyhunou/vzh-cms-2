import { cloneElement } from 'react';

import { useSetState } from './EventContext';

export default ({ value, bind, children }) => {
  const setState = useSetState();

  return cloneElement(children, { [bind]: () => setState(value) });
};
