export default ({ basename = '' } = {}) => {
  const func = {
    fileSrc: async (type, name) => `${basename}/static/${type}/${name}`,
    fileOrigin: (name) => func.fileSrc('origin', name)
  };
  return func;
};
