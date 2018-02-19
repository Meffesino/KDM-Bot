const moment = require('moment');
const chalk = require('chalk');
const path = require('path');

var scriptName = path.basename(__filename);

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${chalk.yellow("Warn:")}`, message);
  };

module.exports = client => { 
    log(chalk.bgYellow("WARN:"));
    log(chalk.bgYellow(e));
};
