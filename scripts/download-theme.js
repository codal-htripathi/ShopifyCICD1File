require('dotenv').config();
const themeKit = require('@shopify/themekit');
const { argv } = require('yargs');
const { getArgs } = require('./helpers');
const {
  paths: { srcDir },
  ignoreFiles
} = require('../app.config');

const args = getArgs({
  dir: argv.dir || srcDir,
  ignoredFiles: ignoreFiles.download
});

/**
 * Required flags are set via environment variables in the form of `THEMEKIT_<flag>`.
 * eg: `THEMEKIT_STORE`, `THEMEKIT_PASSWORD`, etc.
 */

(async () => {
  await themeKit.command('download', args);
})();
