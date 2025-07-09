import { cloneElement } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export default ({ expression, children, ...rest }) => {
  const params = { ...rest, useFormContext, useWatch };

  return cloneElement(
    children,
    // eslint-disable-next-line no-new-func
    new Function(...Object.keys(params), `return ${expression}`)(
      ...Object.values(params)
    )
  );
};
