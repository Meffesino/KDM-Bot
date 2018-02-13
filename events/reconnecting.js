const moment = require('moment');
const chalk = require('chalk');

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${chalk.yellow("Reconnecting:")}`, message);
  };

module.exports = client => { 
    log(chalk.magenta("RECONNECTING:", e));  
};
