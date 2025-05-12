export default () => ({
  resources: {
    imp: {
      init: process.env.RESOURCES_IMP_INIT === 'true',
      path: process.env.RESOURCES_IMP_PATH
    }
  }
});
