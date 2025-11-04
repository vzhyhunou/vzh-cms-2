import sign from 'jwt-encode';

import back from '../back/auth';

export default ({ schemasService }) => {
  const { setToken, ...rest } = back();

  return {
    ...rest,
    async login({ username }) {
      const { authorities } = await schemasService.findContent(
        'user',
        'authorities',
        {
          system: { username }
        }
      );
      const token = sign(
        { sub: username, roles: authorities, exp: Date.now() / 1000 + 86400 },
        'JwtSecretKey'
      );
      await setToken(token);
      return { redirectTo: '/' };
    }
  };
};
