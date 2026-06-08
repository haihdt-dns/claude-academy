/* eslint-disable @typescript-eslint/no-unsafe-argument */

const glob = require('glob');

function collectEntries() {
  const filePaths = glob.sync('./src/js/pages/**/!(_)**{.ts,.js}');

  return ['./src/js/main.js', ...filePaths];
}

module.exports = collectEntries;
