import decodeJwt from 'jwt-decode';

const TOKEN = 'token';

const setItem = (value) => localStorage.setItem(TOKEN, value);
const getItem = () => localStorage.getItem(TOKEN);
const removeItem = () => localStorage.removeItem(TOKEN);
const getClaims = () => {
  const token = getItem();
  return token ? decodeJwt(token) : {};
};

export default () => ({
  async login({ username, password }) {
    const credentials = btoa(`${username}:${password}`);
    const auth = { Authorization: `Basic ${credentials}` };
    const response = await fetch('/auth', { headers: auth });
    const {status, statusText} = response;
    if (status < 200 || status >= 300) {
      throw new Error(statusText);
    }
    setItem(await response.text());
    return { redirectTo: '/' };
  },
  async logout() {
    removeItem();
    return '/';
  },
  async checkError({ status }) {
    if (status === 401 || status === 403) {
      removeItem();
      throw new Error();
    }
  },
  async checkAuth() {
    if (!getItem()) {
      throw new Error();
    }
  },
  async getPermissions() {
    const { roles } = getClaims();
    return roles;
  },
  async getIdentity() {
    const { sub } = getClaims();
    return { id: sub };
  },
  async setToken(value) {
    setItem(value);
  },
  async getToken() {
    return getItem();
  }
});
