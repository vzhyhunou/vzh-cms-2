export const config = () => ({
  datasource: {
    type: process.env.DATASOURCE_TYPE,
    host: process.env.DATASOURCE_HOST,
    port: parseInt(process.env.DATASOURCE_PORT),
    username: process.env.DATASOURCE_USERNAME,
    password: process.env.DATASOURCE_PASSWORD,
    database: process.env.DATASOURCE_DATABASE,
    logging: process.env.DATASOURCE_LOGGING === 'true',
    autoLoadEntities: process.env.DATASOURCE_AUTO_LOAD_ENTITIES === 'true',
    synchronize: process.env.DATASOURCE_SYNCHRONIZE === 'true',
    charset: process.env.DATASOURCE_CHARSET,
    extra: {
      supportBigNumbers: process.env.DATASOURCE_SUPPORT_BIG_NUMBERS === 'true'
    }
  }
});
