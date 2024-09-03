require('dotenv').config();
const themeKit = require('@shopify/themekit');
const { argv } = require('yargs');
const {
  paths: { srcDir }
} = require('../app.config');
/**
 * Required flags are set via environment variables in the form of `THEMEKIT_<flag>`.
 * eg: `THEMEKIT_STORE`, `THEMEKIT_PASSWORD`, etc. **/

(async () => {
  await themeKit.command('open', {
    dir: argv.dir || srcDir
  });
})();
