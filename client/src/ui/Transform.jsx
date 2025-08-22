import b from './bindings';
import { useContextProvider } from '../Context';

export default ({ expression, children, ...rest }) => {
  const { settings } = useContextProvider();

  if (!settings) {
    return null;
  }

  const params = { settings, ...b, ...rest };

  return children(
    // eslint-disable-next-line no-new-func
    ...new Function(...Object.keys(params), `return ${expression}`)(
      ...Object.values(params)
    )
  );
};
