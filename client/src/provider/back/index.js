import getLocaleProvider from '../common/locale';
import getFuncProvider from './func';
import getAuthProvider from './auth';
import getDataProvider from './data';

export default async (props) => {
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
