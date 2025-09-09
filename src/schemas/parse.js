import b from './bindings';

export default (code, bindings) => {
  const params = { ...b, ...bindings };
  return new Function(...Object.keys(params), `return ${code}`)(
    ...Object.values(params)
  );
};
