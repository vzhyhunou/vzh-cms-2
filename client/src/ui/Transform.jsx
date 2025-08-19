import b from './bindings';
import useGetResources from '../provider/data/useGetResources';

export default ({ expression, children, ...rest }) => {
  const { data: config } = useGetResources({ config: true });

  if (!config) {
    return null;
  }

  const params = { config, ...b, ...rest };

  return children(
    // eslint-disable-next-line no-new-func
    ...new Function(...Object.keys(params), `return ${expression}`)(
      ...Object.values(params)
    )
  );
};
