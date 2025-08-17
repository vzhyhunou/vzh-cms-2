import getFuncProvider from './func/back';
import getAuthProvider from './auth/back';
import getDataProvider from './data/back';

export default (props) => {
  const funcProvider = getFuncProvider(props);
  const authProvider = getAuthProvider(props);
  const dataProvider = getDataProvider({ authProvider, ...props });

  return {
    funcProvider,
    authProvider,
    dataProvider
  };
};
