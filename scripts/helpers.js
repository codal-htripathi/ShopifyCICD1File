const _ = require('lodash');
const chalk = require('chalk');
const dayjs = require('dayjs');
const { argv } = require('yargs').array('files').array('ignore_files');

/**
 * Normalizes the command line argument for use with Javascript function.
 *
 * @param {Object} [defaultArgs={}] An argument to parse
 * @returns {Object} parsed arguments
 */
function getArgs(defaultArgs = {}) {
  return Object.keys(argv).reduce((acc, key) => {
    if (key !== '_' && key !== '$0') {
      const val = argv[key];
      const newKey = _.camelCase(key);
      if (acc[newKey] && Array.isArray(acc[newKey])) {
        acc[newKey] = _.uniq(acc[newKey].concat(val));
      } else {
        acc[newKey] = val;
      }
    }
    return acc;
  }, defaultArgs);
}

/**
 * Returns the timestamp with `HH:mm:ss` format.
 *
 * @returns {string} A timestamp string
 */
function ts() {
  return dayjs().format('HH:mm:ss');
}

/**
 * Print received string to `console.log` with the color specified.
 *
 * @param {string} str
 * @param {string} [color='white']
 */
function print(str, color = 'white') {
  console.log(chalk[color](str));
}

/**
 * A log function to print received string to `console.log` with the color specified.
 *
 * @param {string} content
 * @param {string} [color='white']
 */
function log(content, color = 'white') {
  let data = null;
  let message = null;

  if (_.isError(content)) {
    message = content;
    data = content;
  } else if (_.isObject(content)) {
    if (content.message) {
      message = content.message;
    }
    if (content.data) {
      data = content.data;
    } else {
      data = content;
    }
  } else {
    message = content;
  }

  if (message) {
    // matching format with `themekit`
    print(
      chalk.white(
        `${ts()} [${chalk.green('development')}] ${chalk[color](message)}`
      )
    );
  }

  if (data) {
    print('=== START OF OUTPUT ===', color);
    console.dir(data, { depth: null });
    print('=== END OF OUTPUT ===', color);
  }
}

log.info = (content) => log(content, 'white');
log.success = (content) => log(content, 'green');
log.warn = (content) => log(content, 'yellow');
log.error = (content) => log(content, 'red');

module.exports = {
  getArgs,
  print,
  log
};
