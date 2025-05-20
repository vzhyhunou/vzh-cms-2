export default () => ({
  config: {
    port: parseInt(process.env.CONFIG_PORT, 10)
  }
});
