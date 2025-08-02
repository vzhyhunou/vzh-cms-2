import { cloneElement } from 'react';
import useGetConfig from '../provider/data/useGetConfig';

export default ({ resource, name, children, ...params }) => {
  const props = { name, params };
  const { data } = useGetConfig(resource, props);

  if (!data) {
    return null;
  }

  return cloneElement(children, { [name]: data });
};
