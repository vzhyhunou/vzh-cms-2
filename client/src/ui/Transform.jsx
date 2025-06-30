import { createElement } from 'react';
import * as router from 'react-router-dom';
import * as mui from '@mui/material';

import * as ui from '.';

export default ({ components, expression, component, children, ...rest }) => {
  return createElement(
    { ...mui, ...ui, ...router, ...components }[component],
    {
      // eslint-disable-next-line no-new-func
      ...new Function(...Object.keys(rest), `return ${expression}`)(
        ...Object.values(rest)
      ),
      ...rest
    },
    children
  );
};
