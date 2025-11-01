export default () => ({
  config: {
    logger: process.env.LOG_LEVELS.split(','),
    port: parseInt(process.env.CONFIG_PORT, 10)
  }
});
