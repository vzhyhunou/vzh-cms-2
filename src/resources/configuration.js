export default () => ({
  resources: {
    imp: {
      path: process.env.IMP_PATH
    },
    exp: {
      path: process.env.EXP_PATH,
      cron: process.env.EXP_CRON,
      pattern: process.env.EXP_PATTERN,
      limit: parseInt(process.env.EXP_LIMIT, 10)
    }
  }
});
