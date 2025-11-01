import decodeJwt from 'jwt-decode';

const TOKEN = 'token';

export default () => {
  const auth = {
    async login({ username, password }) {
      const credentials = btoa(`${username}:${password}`);
      const headers = { Authorization: `Basic ${credentials}` };
      const response = await fetch('/auth', { headers });
      const { status, statusText } = response;
      if (status < 200 || status >= 300) {
        throw new Error(statusText);
      }
      await auth.setToken(await response.text());
      return { redirectTo: '/' };
    },
    async logout() {
      await auth.removeToken();
      return '/';
    },
    async checkError({ status }) {
      if (status === 401 || status === 403) {
        await auth.removeToken();
        throw new Error();
      }
    },
    async checkAuth() {
      if (!(await auth.getToken())) {
        throw new Error();
      }
    },
    async getClaims() {
      const token = await auth.getToken();
      if (!token) {
        return {};
      }
      const claims = decodeJwt(token);
      const { exp } = claims;
      if (exp > Date.now() / 1000) {
        return claims;
      }
      await auth.removeToken();
      return {};
    },
    async getPermissions() {
      const { roles } = await auth.getClaims();
      return roles;
    },
    async getIdentity() {
      const { sub } = await auth.getClaims();
      return { id: sub };
    },
    async setToken(value) {
      localStorage.setItem(TOKEN, value);
    },
    async getToken() {
      return localStorage.getItem(TOKEN);
    },
    async removeToken() {
      localStorage.removeItem(TOKEN);
    }
  };
  return auth;
};
