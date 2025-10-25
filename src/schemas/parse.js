import b from './bindings';

export default (code, { request = {}, system = {}, ...rest } = {}) => {
  const params = {
    ...b,
    ...rest,
    request,
    system
  };
  return new Function(...Object.keys(params), `return ${code}`)(
    ...Object.values(params)
  );
};
