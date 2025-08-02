import { useQuery } from '@tanstack/react-query';
import { useDataProvider } from 'react-admin';

export default (resource, props) => {
  const { getConfig } = useDataProvider();

  return useQuery({
    queryKey: ['getConfig', resource, props],
    queryFn: () => getConfig(resource, props).then(({ data }) => data),
    refetchOnWindowFocus: false
  });
};
