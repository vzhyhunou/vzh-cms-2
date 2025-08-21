import decodeJwt from 'jwt-decode';

const TOKEN = 'token';

export default () => ({
  async login({ username, password }) {
    const credentials = btoa(`${username}:${password}`);
    const auth = { Authorization: `Basic ${credentials}` };
    const response = await fetch('/auth', { headers: auth });
    const { status, statusText } = response;
    if (status < 200 || status >= 300) {
      throw new Error(statusText);
    }
    await this.setToken(await response.text());
    return { redirectTo: '/' };
  },
  async logout() {
    await this.removeToken();
    return '/';
  },
  async checkError({ status }) {
    if (status === 401 || status === 403) {
      await this.removeToken();
      throw new Error();
    }
  },
  async checkAuth() {
    if (!(await this.getPermissions())) {
      throw new Error();
    }
  },
  async getPermissions() {
    const { roles } = await this.getClaims();
    return roles;
  },
  async getIdentity() {
    const { sub } = await this.getClaims();
    return { id: sub };
  },
  async getClaims() {
    const token = await this.getToken();
    if (!token) {
      return {};
    }
    const claims = decodeJwt(token);
    const { exp } = claims;
    if (exp > Date.now() / 1000) {
      return claims;
    }
    await this.removeToken();
    return {};
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
});
