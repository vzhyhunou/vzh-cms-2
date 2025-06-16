import { useQuery } from '@tanstack/react-query';
import { useDataProvider } from 'react-admin';

export default (resource, props) => {
  const { getComponent } = useDataProvider();

  return useQuery({
    queryKey: ['getComponent', resource, props],
    queryFn: () => getComponent(resource, props).then(({ data }) => data),
    refetchOnWindowFocus: false
  });
};
