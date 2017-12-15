const moment = require('moment');
const chalk = require('chalk');

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
  };

module.exports = client => { 
    client.user.setGame(`KD:M - White Secret Event`); 
    log(chalk.bgGreen(`Bot online at Discord, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`)); 

};
