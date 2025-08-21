export const config = () => ({
  auth: {
    expiration: parseInt(process.env.AUTH_EXPIRATION, 10),
    secret: process.env.AUTH_SECRET
  }
});
