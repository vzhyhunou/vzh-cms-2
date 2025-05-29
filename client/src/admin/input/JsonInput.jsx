import React from 'react';
import { TextInput } from 'react-admin';

export default (props) => (
  <TextInput
    {...props}
    format={(v) => JSON.stringify(v, (k, v) => (v ? v : undefined), 2)}
    parse={(v) => JSON.parse(v)}
  />
);
