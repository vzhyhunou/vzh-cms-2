import { useQuery } from '@tanstack/react-query';
import { useDataProvider } from 'react-admin';

export default (resource, props) => {
  const { getContent } = useDataProvider();

  return useQuery({
    queryKey: ['getContent', resource, props],
    queryFn: () => getContent(resource, props).then(({ data }) => data),
    refetchOnWindowFocus: false
  });
};
