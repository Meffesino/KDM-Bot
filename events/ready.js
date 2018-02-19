const moment = require('moment');
const chalk = require('chalk');
const path = require('path');

var scriptName = path.basename(__filename);

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${chalk.gray(scriptName)}`,message);
  };

module.exports = client => { 
    log(chalk.bgGreen(`Ready: Bot online at Discord, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`))
    client.user.setActivity(`KD:M - White Secret Event`) 

    // Shop Starting:
    log(chalk.yellow(`Ready: Starting Shop`))
    //var message = { "author" : { "username" : "READY COMMAND" } }

    var message = "0" //blank, that the command will not messed up
    let command = "shop";
    let args = [ "init" ];
    let cmd = client.commands.get(command);
    cmd.run(client, message, args);

    // Twitter Starting:
    log(chalk.yellow(`Ready: Starting Twitter`))
    var message = { "author" : { "username" : "READY COMMAND" } }
    let command = "twitter";
    let args = [ "init" ];
    let cmd = client.commands.get(command);
    cmd.run(client, message, args);

};
