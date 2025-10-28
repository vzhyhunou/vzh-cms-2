import getLocaleProvider from './locale';
import getFuncProvider from './func/back';
import getAuthProvider from './auth/back';
import getDataProvider from './data/back';

export default (props) => {
  const localeProvider = getLocaleProvider(props);
  const funcProvider = getFuncProvider(props);
  const authProvider = getAuthProvider(props);
  const dataProvider = getDataProvider({
    localeProvider,
    authProvider,
    ...props
  });

  return {
    localeProvider,
    funcProvider,
    authProvider,
    dataProvider
  };
};
