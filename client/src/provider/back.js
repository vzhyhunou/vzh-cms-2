import getFuncProvider from './func/back';
import getDataProvider from './data/back';

export default (props) => ({
  funcProvider: getFuncProvider(props),
  dataProvider: getDataProvider(props)
});
