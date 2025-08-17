import { cloneElement } from 'react';

import b from './bindings';

export default ({ expression, children, ...rest }) => {
  const params = { ...b, ...rest };

  return cloneElement(
    children,
    // eslint-disable-next-line no-new-func
    new Function(...Object.keys(params), `return ${expression}`)(
      ...Object.values(params)
    )
  );
};
