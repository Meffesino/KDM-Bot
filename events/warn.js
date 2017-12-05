const moment = require('moment');
const chalk = require('chalk');

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
  };

module.exports = client => { 
    log(chalk.bgYellow("WARN:"));
    log(chalk.bgYellow(e));
};
