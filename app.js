
const Discord = require("discord.js"); // Load up the discord.js library
const client = new Discord.Client({ fetchAllMembers: true }, {autoReconnect:true} ); // This is the client of Discord. 
const config = require("./config.json"); // Here we load the config.json file that contains our token and our prefix values. 
//const prefix = config.prefix //loading the prefix set in the config file
const moment = require('moment');
const fs = require("fs");
//const mysql = require('mysql');
const sql = require('./util/sql.js')
const chalk = require('chalk');
//const util = require('util')
const path = require('path');
const logmongo = require('./cmd/logmongo.js');

var scriptName = path.basename(__filename);

require('./util/eventLoader')(client);

//Logging now log() instead of console.log()
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${chalk.yellow(scriptName)}`,message);
};

// For Command Handler
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir(__dirname + '/cmd/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./cmd/${f}`);
    log(chalk.bgCyanBright(`Loading Command: ${props.help.name}. :ok_hand:`));
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.on("message", async message => {
  //log(message) // Will show the Message which was received.
  // This event will run on every single message received, from any channel or DM.
  try {
    logmongo.logmongo(message, client)
  }
  catch (error) {
    log(chalk.red("Error in logmongo.js: ") + error)
  }
  
  if(message.author.bot) return; //ignore bots
  
  if (message.channel.type != 'dm') { // Check if the message was not a direct message.
    if ((message.guild.id != config.serverid) && (message.guild.id != config.serverid2)) return;  
    //guild.id 268743075990470656 = Lantern's Reign Guild ID 
    //guild.id  
  }
 
  // message start with prefix?
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
 

  let command = message.content.split(" ")[0].slice(config.prefix.length).toLowerCase();
  let args = message.content.split(" ").slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } 
  else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) {
      log(`${chalk.red(`Permissions to low:`)} ${message.author.username} - Command: '${command}' - Permission: ${perms} < ${cmd.conf.permLevel}`)
      return
    };
    //console.log(util.inspect(cmd, false, null))
    cmd.run(client, message, args, perms, command);
  }

});

client.login(config.token, function(error, token){
  if (token) {
    log(`Client Login Token`, token)
  }

  if (error) {
    log(chalk.red("**Client Login error!**")),
    log(error);
  }
});


client.on('warn', e => {
  log(chalk.bgYellow("WARN:"));
  log(chalk.bgYellow(e));
});

client.on('error', e => {
  log(chalk.bgRed("ERROR"));
  log(chalk.bgRed(e));
});

client.on('reconnecting', e => {
  log(chalk.magenta("RECONNECTING:"));  
  log(chalk.magenta(e));
});

client.on('disconnect', e => {
  log(chalk.bgWhite.red(`DISCONNECTED!! DISCONNECTED!! DISCONNECTED!! DISCONNECTED!! DISCONNECTED!!`));  
  log(chalk.bgWhite.red(e));
});

client.on('debug', e => {
 if ((e.indexOf("Sending a heartbeat") == -1 ) && (e.indexOf("Heartbeat acknowledged") == -1 )) { //reducing spamming of debug. But still shows the latency.
    log(chalk.gray(e));
  }

  if (e.indexOf("Heartbeat acknowledged") >= 0) {
    //log(`Hearbeat! ${moment().format('YYYY-MM-DD HH:mm:ss')} ${client.pings} ${client.ping}`);
    //log(chalk.gray(e));
  }
});

client.on('ready', e => {
  log(chalk.bgGreen(`Ready: Bot online at Discord, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`))
  client.user.setActivity(`KD:M - White Secret Event`) 

  // Shop Starting:
  log(chalk.yellow(`Ready: Starting Shop`))
  //var message = { "author" : { "username" : "READY COMMAND" } }

  var messageTemp = "0" //blank, that the command will not messed up
  var commandTemp = "shop";
  var argsTemp = [ "init" ];
  var cmdTemp = client.commands.get(commandTemp);
  cmdTemp.run(client, messageTemp, argsTemp);

  // Twitter Starting:
  log(chalk.yellow(`Ready: Starting Twitter`))
  var messageTemp2 = { "author" : { "username" : "READY COMMAND" } }
  let commandTemp2 = "twitter";
  let argsTemp2 = [ "init" ];
  let cmdTemp2 = client.commands.get(commandTemp2);
  cmdTemp2.run(client, messageTemp2, argsTemp2);
});

// For Command Handler
client.reload = function(command) {
  log(chalk.yellow(`CLIENT.RELOAD - Should reload commands now`))
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./cmd/${command}`)];
      let cmd = require(`./cmd/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });

      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

// For Command Handler
client.elevation = function(message) {
  /* This function should resolve to an ELEVATION level which
     is then sent to the command handler for verification*/
  let permlvl = 0;
  if (message.channel.type != 'dm') {
    let mod_role = message.guild.roles.find("name", config.modrolename);
    if(mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
    let admin_role = message.guild.roles.find("name", config.adminrolename);
    if(admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;
    if(message.author.id === config.ownerid) permlvl = 4;
  }
  else {
    if(message.author.id === config.ownerid) permlvl = 4;
  }
  return permlvl;
};
