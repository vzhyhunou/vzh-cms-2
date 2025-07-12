import useGetContent from '../provider/data/useGetContent';

export default ({ resource, name, children, ...params }) => {
  const props = { name, params };
  const { data } = useGetContent(resource, props);

  if (!data) {
    return null;
  }

  return Array.isArray(data) ? data.map((i) => children(i)) : children(data);
};
