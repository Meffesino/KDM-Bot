const Discord = require('discord.js');
const config = require("../config.json");
const package = require("../package.json");
const sql = require('../util/sql.js');
const moment = require('moment');
const chalk = require('chalk');

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
  };

exports.run = (client, message, args = []) => {

 // var query = pool.query("SELECT UPDATE_TIME FROM information_schema.tables WHERE TABLE_SCHEMA = 'd0287d28' AND TABLE_NAME = 'Glossary'", function(error, results, fields) {


  var updatetime;
  var count;
  var qryamount;
  var Glossary = { table:"Glossary", }
  var FAQ = {table:"FAQ", }
  var error2;

  log(chalk.bgWhite.gray(`${chalk.blueBright.bold(`INFO:`)} ${message.author.username}`));

//get info from Glossary first (Last Updatetime, How many Entries and how many Querries... You can copy this later and perform Cards.table etc. too
GetInfo(Glossary.table, function(error, updatetime, count, qryamount) {  
  if (error) { 
    log(chalk.bgYellow("ERROR... ->", error));
  }
  Glossary = { updatetime: updatetime , count : count , qryamount : qryamount }

    GetInfo(FAQ.table, function(error, updatetime, count, qryamount) {  
      if (error) { 
        log(chalk.bgYellow("ERROR... ->", error)); 
      }
      FAQ = { updatetime: updatetime , count : count , qryamount : qryamount }
    
      // send message Command can be replaced later with the other FAQ.Tables etc.
      sendMessage()
    });
});







function GetInfo(table, callback) { 
  /* Process: 
  1: "updateTimeAndCount and transfer Table, to identify". This triggers the SQL
  2: SQL result will be given to _QryAmount, which will first trigger _checkForErrors
  3: _check for Errors will check if any Error occures
  */
function _checkForErrors(error, results, reason) {
      if (error) {
          error2 = `error to perform on table: '${table}' in section '${reason}' with Error:'${error}`;
          return true;
      } 
      if (results.length === 0) {
          error2 = `failure to perform on table: '${table}' in section '${reason}'`;
          return true;
      }
      return false;
}

  function _QryAmount(error, results) {
      if (_checkForErrors(error, results, 'QryAmount')) {
          callback(error2, updatetime, count, qryamount)
      } else {
          updatetime = results[0].Updatetime
          count = results[0].Count
          execute = execute = `Select Searchtable, Count(*) as 'Count' From SQLLog Where Searchtable = '${table}' group by Searchtable`
          sql.simpleqry(execute, _getData);
      }
  }

  function _getData(error, results) {
      if (_checkForErrors(error, results, 'getData')) {

      } else {
          qryamount = results[0].Count
      }
  callback(error2, updatetime, count, qryamount)
      
  }


  function UpdateTimeAndCount(table) {
      execute = `Select MAX(UPDATETIME) as Updatetime, Count(*) as 'Count' From ${table}`
      sql.simpleqry(execute, _QryAmount);
  }

  UpdateTimeAndCount(table);
}




function sendMessage() {
  message.author.send(`
  \`\`\`
  = STATISTICS =
  • Bot Version : ${package.version}

  • Users       : ${client.users.size}
  • Servers     : ${client.guilds.size}
  • Channels    : ${client.channels.size}

  • Glossary DB : ${Glossary.count} Entries
                  ${Glossary.qryamount} Querries
                  ${Glossary.updatetime} Last Update 
  
  • FAQ DB      : ${FAQ.count} Entries
                  ${FAQ.qryamount} Querries
                  ${FAQ.updatetime} Last Update 

  • Bot Authors : ${package.author}
  \`\`\``);
  };

};


exports.conf = {
  enabled: true,
  guildOnly: false,
  ShowHelp: true,
  Children: [ ],
  aliases: ['details'],
  permLevel: 0
};

exports.help = {
  name: "info",
  description: "Provides some information about this bot.\n",
  usage: "info",
  example: `${config.prefix}info`,
  description_detailed: "Provides some information about this bot like uptime, servers, usage"
};
