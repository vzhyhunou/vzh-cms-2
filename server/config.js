export default ((storage) => ({
  logger: ['log', 'fatal', 'error', 'warn'],
  port: 8090,
  datasource: {
    type: 'sqlite',
    database: ':memory:',
    logging: false,
    charset: 'utf8mb4',
    extra: {
      supportBigNumbers: false
    },
    entities: []
  },
  auth: {
    expiration: 86400, // 1 day
    secret: 'JwtSecretKey'
  },
  resources: {
    imp: {
      path: `${storage}/import/cms.zip`
    },
    exp: {
      path: `${storage}/export`,
      cron: '0 0 3 * * *', // every day
      pattern: 'YYYYMMDDHHmm',
      limit: 5
    }
  },
  locations: {
    public: 'dist/public',
    static: `${storage}/static`,
    origin: `${storage}/static/origin`
  }
}))('storage');