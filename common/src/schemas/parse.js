import b from './bindings';

const parse = (code, { request = {}, system = {}, ...rest } = {}) => {
  const params = {
    parse,
    ...b,
    ...rest,
    request,
    system
  };
  return new Function(
    ...Object.keys(params),
    `return (async () => (${code}))()`
  )(...Object.values(params));
};

export default parse;
