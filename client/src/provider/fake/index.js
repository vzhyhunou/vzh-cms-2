import getLocaleProvider from '../common/locale';
import getFuncProvider from './func';
import getAuthProvider from './auth';
import getDataProvider from './data';
import getServices from './modules';

export default async (props) => {
  const { schemasService, storageService } = await getServices(props);

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
    storageService,
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
