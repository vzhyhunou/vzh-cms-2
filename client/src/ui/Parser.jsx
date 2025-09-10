import parse, { adminParse } from './parse';
import { useSettings } from '../context/SettingsContext';
import { AdminComponent } from './Component';

const Parser = ({ code, bindings }) => {
  const settings = useSettings();
  return parse(code, { Parser, settings, ...bindings });
};

export const AdminParser = ({ code, bindings }) => {
  const settings = useSettings();
  return adminParse(code, {
    Parser: AdminParser,
    Component: AdminComponent,
    settings,
    ...bindings
  });
};

export default Parser;
