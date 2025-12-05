import { useDataProvider, useResourceContext } from 'react-admin';

export const useUniqId = (name = 'id', message = 'resources.validation.id') => {
  const { getOne } = useDataProvider();
  const resource = useResourceContext();

  return (value) =>
    getOne(resource, { [name]: value }).then(
      () => message,
      () => {}
    );
};
