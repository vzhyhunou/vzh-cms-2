import React, { useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export default ({ component: Component, source, parse, ...rest }) => {
  const { setValue } = useFormContext();
  const value = useWatch({ name: 'parse' });
  const [state, setState] = useState('');

  useEffect(() => {
    source &&
      (value
        ? value.includes(source) || setValue('parse', [...value, source])
        : setValue('parse', [source]));
  }, [setValue, value, source]);

  return (
    <Component
      {...rest}
      source={source}
      parse={(value) => (() => parse(value))(setState(value))}
      format={() => state}
    />
  );
};
