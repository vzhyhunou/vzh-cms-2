const LOCALE = 'locale';

export default () => {
  const setItem = (value) => localStorage.setItem(LOCALE, value);
  const getItem = () => localStorage.getItem(LOCALE);

  return {
    setLocale: (value) => Promise.resolve(value).then(setItem),
    getLocale: () => Promise.resolve().then(getItem)
  };
};
