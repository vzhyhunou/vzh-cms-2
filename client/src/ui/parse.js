import b from './bindings';
import a from './admin';

const parse = (code, bindings) => {
  const params = { parse, ...b, ...bindings };
  // eslint-disable-next-line no-new-func
  return new Function(
    ...Object.keys(params),
    code.includes('var result') ? `${code}; return result` : `return ${code}`
  )(...Object.values(params));
};

export const adminParse = (code, bindings) => {
  return parse(code, {
    parse: adminParse,
    ...a,
    ...bindings
  });
};

export default parse;
