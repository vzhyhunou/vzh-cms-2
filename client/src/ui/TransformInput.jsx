import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import Transform from './Transform';

const NAME = 'transform';

export default ({ source, children, ...rest }) => {
  const { setValue } = useFormContext();
  const val = useWatch({ name: NAME });

  useEffect(() => {
    if (!source) {
      return;
    }
    if (!val) {
      setValue(NAME, [source]);
      return;
    }
    if (!val.includes(source)) {
      setValue(NAME, [...val, source]);
    }
  }, [setValue, source, val]);

  return <Transform {...{ source, ...rest }}>{children}</Transform>;
};
