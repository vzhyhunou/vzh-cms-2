export default {
  provider: import(`./provider/${process.env.REACT_APP_SRC}.js`),
  basename: process.env.REACT_APP_BASE
};
