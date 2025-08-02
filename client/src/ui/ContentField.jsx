import { cloneElement } from 'react';
import useGetContent from '../provider/data/useGetContent';

export default ({ resource, name, children, ...params }) => {
  const props = { name, params };
  const { data } = useGetContent(resource, props);

  if (!data) {
    return null;
  }

  return Array.isArray(data)
    ? data.map((i) => cloneElement(children, { [name]: i }))
    : cloneElement(children, { [name]: data });
};
