const config = require("../config.json");
const moment = require('moment');
const chalk = require('chalk');

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
  };


exports.run = (client, message, args) => {




  log(chalk.bgWhite.gray(`${chalk.blueBright.bold(`Help:`)} ${message.author.username}`));
  //Show ?help commands.
  if (!args[0]) {
    var a = client.commands.map(c=>c.help.name)
    var s = ("")
    for (val of a) {
      command = client.commands.get(val);
      if (command.conf.ShowHelp === true) {  // Show only the commands, which are flagged as "ShowHelp True"
      var s = s + (`${command.help.name}:: ${command.help.description}\n`)
      }
    }
    message.author.send(`= Command List =\n\n[Use ${client.commands.get("help").help.example} <commandname> for details]\n\n${s}`,{code: 'asciidoc'});
  } 

  // check details of commands @ ?help <command>
  else {

    let command;
    if (client.commands.has(args[0])) {
      command = client.commands.get(args[0]);
    } else if (client.aliases.has(args[0])) {
      command = client.commands.get(client.aliases.get(args[0]));
    }
    if (command) {
      message.author.send(`= ${command.help.name} =\n${command.help.description_detailed}\nusage::   ${config.prefix}${command.help.usage}\nAliases:: ${command.conf.aliases.map(c=>`${config.prefix}${c}`)}\nexample:: ${command.help.example}`, {code: 'asciidoc'});
    }
  }
};



exports.conf = {
  enabled: true,
  guildOnly: false,
  ShowHelp: true,
  Children: [ ],
  aliases: [`h`],
  permLevel: 0
};

exports.help = {
  name : "help",
  description: "It is showing all commands, which are available.\n",
  usage: "help",
  example: `${config.prefix}help`,
  description_detailed: "It is showing all commands, which are available.\n"
};
