import { useQuery } from '@tanstack/react-query';
import { useDataProvider } from 'react-admin';

export default (props) => {
  const { getResources } = useDataProvider();

  return useQuery({
    queryKey: ['getResources', props],
    queryFn: () => getResources(props).then(({ data }) => data),
    refetchOnWindowFocus: false
  });
};
