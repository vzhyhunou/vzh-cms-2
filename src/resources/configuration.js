export default () => ({
  resources: {
    imp: {
      init: process.env.RESOURCES_IMP_INIT === 'true',
      path: process.env.RESOURCES_IMP_PATH
    },
    exp: {
      path: process.env.RESOURCES_EXP_PATH,
      cron: process.env.RESOURCES_EXP_CRON,
      pattern: process.env.RESOURCES_EXP_PATTERN,
      limit: parseInt(process.env.RESOURCES_EXP_LIMIT, 10)
    }
  }
});
