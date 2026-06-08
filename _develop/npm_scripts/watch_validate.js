/* eslint-disable */

const chokidar = require('chokidar');
const pathNode = require('path');
const validate = require('html-validate');
const configs = require('../htmlvalidate.json');
const colors = require('./colors.cjs');
const paths = require('../paths.cjs');


const watchFiles = `${paths.appBuild}/**/*.html`;
const ignoredFiles = [`${paths.appBuild}/second/**/*.html`, `${paths.appBuild}/assets/**/*.html`];

const watcher = chokidar.watch(watchFiles, {
  ignored: ignoredFiles,
  persistent: true,
});
const validateConfig = new validate.HtmlValidate(configs);

const checkValidate = async (path) => {
  const validateFile = await validateConfig.validateFile(path);
  const errorCount = validateFile.errorCount;
  const warningCount = validateFile.warningCount;
  const totalCount = errorCount + warningCount;
  if (totalCount > 0) {
    console.log('\n\n');
    console.log('*'.repeat(60));
    console.log(`\n${colors.green}File path: ${colors.red}${pathNode.join(process.cwd(), path)}${colors.reset}\n`);
    console.log(`${colors.red}${totalCount} problems (${errorCount} errors, ${warningCount} warning)${colors.reset}\n`);
    console.log('-'.repeat(60));
    console.log();
    const severity = ['', `${colors.yellow}warning`, `${colors.red}error`];
    for (const result of validateFile.results) {
      const lines = (result.source ?? '').split('\n');
      for (const message of result.messages) {
        const marker = message.size === 1 ? '▲' : '━'.repeat(message.size);
        console.log(
          `${message.line}:${message.column} ${severity[message.severity]}:${colors.reset} ${message.message}  ${colors.green}(${message.ruleId
          })${colors.reset}`,
        );
        console.log(`${lines[message.line - 1]}`);
        console.log(`${' '.repeat(message.column - 1)}${marker}`);
      }
      console.log('\n');
      console.log('-'.repeat(60));
      console.log(`\n${colors.green}Link rule:${colors.reset}`);
      console.log();
      const tempRuleUrls = result.messages.map((message) => message.ruleUrl);
      const ruleUrls = [...new Set(tempRuleUrls)];
      for (const ruleUrl of ruleUrls) {
        console.log(ruleUrl);
      }
    }
    console.log('\n\n');
    console.log('*'.repeat(60));
  }
};

watcher.on('add', (path) => checkValidate(path)).on('change', (path) => checkValidate(path));
