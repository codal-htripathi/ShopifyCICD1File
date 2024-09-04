const { argv } = require('yargs');

const { getArgs, print, log } = require('./helpers');
const checkThemeFiles = require('./utils/check-theme-files');

async function exec(args) {
  try {
    const updated = await checkThemeFiles(args);

    if (updated.length) {
      log.success('Updated remote asset found');
      updated.forEach(({ asset }) => {
        const { localMtime, remoteMtime, localSize, remoteSize } = asset;
        print(
          `[${asset.key}] local:(updated: ${localMtime}, size: ${localSize}) remote:(updated: ${remoteMtime}, size: ${remoteSize})`
        );
      });
    } else {
      log.success('No updates to remote assets');
    }

    return updated;
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
}

// execute immediately when it's not explicitly called from Github Action but from npm script
if (argv.$0.search('github-script') === -1) {
  const args = getArgs();
  exec(args);
}

module.exports = exec;
