import { useState } from 'react';

export default ({ expression, children, ...rest }) => {
  return children(
    // eslint-disable-next-line no-new-func
    ...new Function(
      ...Object.keys({ ...rest, useState }),
      `return ${expression}`
    )(...Object.values({ ...rest, useState }))
  );
};
