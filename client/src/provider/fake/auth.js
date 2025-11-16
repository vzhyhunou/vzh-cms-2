import sign from 'jwt-encode';

import back from '../back/auth';

export default ({ schemasService }) => {
  const { setToken, ...rest } = back();

  return {
    ...rest,
    async login({ username }) {
      const {
        schema: {
          contents: {
            authorities: { resource, name }
          }
        }
      } = await schemasService.findSettings();
      const user = await schemasService.findContent(resource, name, {
        system: { username }
      });
      if (!user) {
        throw new Error('User not found');
      }
      const { authorities } = user;
      const token = sign(
        { sub: username, roles: authorities, exp: Date.now() / 1000 + 86400 },
        'JwtSecretKey'
      );
      await setToken(token);
      return { redirectTo: '/' };
    }
  };
};
