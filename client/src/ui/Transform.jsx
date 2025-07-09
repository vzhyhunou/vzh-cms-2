import { useState } from 'react';

export default ({ expression, children, ...rest }) => {
  const params = { ...rest, useState };

  return children(
    // eslint-disable-next-line no-new-func
    ...new Function(...Object.keys(params), `return ${expression}`)(
      ...Object.values(params)
    )
  );
};
