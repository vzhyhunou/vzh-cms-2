import { cloneElement } from 'react';

import b from './bindings';
import useGetResources from '../provider/data/useGetResources';

export default ({ expression, children, ...rest }) => {
  const { data: settings } = useGetResources({ settings: true });

  if (!settings) {
    return null;
  }

  const params = { settings, ...b, ...rest };

  return cloneElement(
    children,
    // eslint-disable-next-line no-new-func
    new Function(...Object.keys(params), `return ${expression}`)(
      ...Object.values(params)
    )
  );
};
