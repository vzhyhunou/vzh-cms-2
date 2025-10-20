import polyglotI18nProvider from 'ra-i18n-polyglot';

export default (
  { localeProvider: { setLocale } },
  locales,
  locale,
  messages,
  getMessages
) =>
  polyglotI18nProvider(
    (value) => {
      if (messages) {
        try {
          return messages;
        } finally {
          messages = undefined;
        }
      }
      return setLocale(value).then(getMessages);
    },
    locale,
    Object.entries(locales).map(([key, value]) => ({
      locale: key,
      name: value
    }))
  );
