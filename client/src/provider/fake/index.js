import getLocaleProvider from '../common/locale';
import getFuncProvider from './func';
import getAuthProvider from './auth';
import getDataProvider from './data';
import getServices from './modules';

export default async (props) => {
  const { schemasService } = await getServices();

  const localeProvider = getLocaleProvider(props);
  const funcProvider = getFuncProvider({
    schemasService,
    ...props
  });
  const authProvider = getAuthProvider({
    schemasService,
    ...props
  });
  const dataProvider = getDataProvider({
    schemasService,
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
