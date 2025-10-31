export default {
  provider: import(`./provider/${process.env.REACT_APP_SRC}/index.js`),
  basename: process.env.REACT_APP_BASE
};
