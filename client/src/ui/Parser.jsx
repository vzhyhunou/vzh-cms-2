import parse, { adminParse } from './parse';
import { useContextProvider } from '../Context';

const Parser = ({ code, bindings }) => {
  const { settings } = useContextProvider();
  return parse(code, { Parser, settings, ...bindings });
};

export const AdminParser = ({ code, bindings }) => {
  const { settings } = useContextProvider();
  return adminParse(code, { Parser: AdminParser, settings, ...bindings });
};

export default Parser;
