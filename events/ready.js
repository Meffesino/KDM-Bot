const moment = require('moment');
const chalk = require('chalk');

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
  };

module.exports = client => { 
    client.user.setActivity(`KD:M - White Secret Event`) 
    log(chalk.bgGreen(`Bot online at Discord, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`))

    log(chalk.yellow(`Starting Shop`))
    var message = "0" //blank, that the command will not messed up
    let command = "shop";
    let args = [ "init" ];
    let cmd = client.commands.get(command);
    cmd.run(client, message, args);
};
