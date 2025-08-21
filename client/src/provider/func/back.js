export default ({ basename = '' } = {}) => {
  const func = {
    pathByData: (type, name) => `${basename}/static/${type}/${name}`,
    originByData: (name) => func.pathByData('origin', name)
  };

  return func;
};
