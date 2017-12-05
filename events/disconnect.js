const moment = require('moment');
const chalk = require('chalk');

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
  };

module.exports = client => { 
    log(chalk.bgWhite.red(`DISCONNECTED!! DISCONNECTED!! DISCONNECTED!! DISCONNECTED!! DISCONNECTED!!`));  
    log(chalk.bgWhite.red(e));
};
