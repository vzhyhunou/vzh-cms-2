import { I18nContext } from 'nestjs-i18n';

import b from './bindings';

export default (code, bindings = {}) => {
  const params = {
    ...b,
    ...bindings,
    request: bindings.request || {},
    system: { ...bindings.system, locale: I18nContext.current()?.lang }
  };
  return new Function(...Object.keys(params), `return ${code}`)(
    ...Object.values(params)
  );
};
