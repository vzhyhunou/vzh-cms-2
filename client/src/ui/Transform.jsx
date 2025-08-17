import { useState } from 'react';
import * as admin from 'react-admin';
import * as router from 'react-router-dom';

export default ({ expression, children, ...rest }) => {
  const params = { ...rest, useState, ...admin, ...router };

  return children(
    // eslint-disable-next-line no-new-func
    ...new Function(...Object.keys(params), `return ${expression}`)(
      ...Object.values(params)
    )
  );
};
