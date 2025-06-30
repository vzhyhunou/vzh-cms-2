import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import TransformField from './TransformField';

const NAME = 'transform';

export default ({ source, children, ...rest }) => {
  const { setValue } = useFormContext();
  const val = useWatch({ name: NAME });

  useEffect(() => {
    if (!val) {
      setValue(NAME, [source]);
      return;
    }
    if (!val.includes(source)) {
      setValue(NAME, [...val, source]);
    }
  }, [setValue, source, val]);

  return (
    <TransformField {...{ source }} {...rest}>
      {children}
    </TransformField>
  );
};
