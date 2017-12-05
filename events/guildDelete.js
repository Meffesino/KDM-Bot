const moment = require('moment');
const chalk = require('chalk');

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
  };

module.exports = client => { 
  log(chalk.bgRed(`I have been removed from: ${guild.name} (id: ${guild.id})`));
};