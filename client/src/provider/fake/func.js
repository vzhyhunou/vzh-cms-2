import extList from 'ext-list';

const FILE = 'file';
const map = extList();
const metaByName = (name) => map.get(name.split('.')[1]);

export default ({ schemasService }) => {
  const valueByName = async (name) =>
    (await schemasService.findById(FILE, name)).value;
  const func = {
    pathByData: async (type, name) =>
      `data:${metaByName(name)};base64,${await valueByName(name)}`,
    originByData: (name) => func.pathByData(undefined, name)
  };
  return func;
};
