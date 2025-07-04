import { cloneElement } from 'react';

export default ({ expression, children, ...rest }) => {
  return cloneElement(
    children,
    // eslint-disable-next-line no-new-func
    new Function(...Object.keys(rest), `return ${expression}`)(
      ...Object.values(rest)
    )
  );
};
