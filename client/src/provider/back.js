import getDataProvider from './data/back';

export default (props) => ({
  dataProvider: getDataProvider(props)
});
