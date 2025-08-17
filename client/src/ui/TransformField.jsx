import { cloneElement } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import * as admin from 'react-admin';
import * as router from 'react-router-dom';

export default ({ expression, children, ...rest }) => {
  const params = { ...rest, useFormContext, useWatch, ...admin, ...router };

  return cloneElement(
    children,
    // eslint-disable-next-line no-new-func
    new Function(...Object.keys(params), `return ${expression}`)(
      ...Object.values(params)
    )
  );
};
