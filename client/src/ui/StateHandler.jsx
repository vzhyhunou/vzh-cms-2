import { useState } from 'react';

export default ({ value, children }) => {
  const [state, setState] = useState(value);

  return children(state, setState);
};
