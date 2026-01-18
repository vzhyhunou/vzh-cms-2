import extList from 'ext-list';

const STATIC = 'static';
const map = extList();
const metaByName = (name) => map.get(name.split('.')[1]);

export default ({ schemasService }) => {
  const fileValue = async (name) =>
    (await schemasService.findById(STATIC, name)).value;
  const func = {
    fileSrc: async (type, name) =>
      `data:${metaByName(name)};base64,${await fileValue(name)}`,
    fileOrigin: (name) => func.fileSrc(undefined, name)
  };
  return func;
};
