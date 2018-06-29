const moment = require('moment');
const chalk = require('chalk');
const path = require('path');
const mongo = require('../util/mongo.js')
const config = require("../config.json");


var scriptName = path.basename(__filename);

module.exports.logmongo = logmongo; //trigger the insert command.

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${chalk.yellow(scriptName)}`,message);
};

function logmongo(message, client) {

    var words = WordCount(message.cleanContent) 
    if (((message.channel.type == 'text') || (message.channel.type == 'dm')) && (words > 0)) {
        var sqlinsert = { }
        //log("-----AUTHOR-----")
        sqlinsert.type = message.channel.type
        sqlinsert.author = { }
        sqlinsert.author.id = message.author.id
        sqlinsert.author.username = message.author.username
        //log(message.author.id)
        //log(message.author.username)
        //log("-----CHANNEL-----")
        //log(message.channel.type)
        if (message.channel.type == 'text') {
            //log("-----GUILD & Channel----")
            sqlinsert.guild = { }
            sqlinsert.guild.id = message.guild.id
            sqlinsert.guild.name = message.guild.name
            sqlinsert.guild.memberCount = message.guild.memberCount
            
            sqlinsert.channel = { },
            sqlinsert.channel.id = message.channel.id
            sqlinsert.channel.name = message.channel.name
            //log(message.guild.id) //geht nicht bei message.channel.type = dm
            //log(message.guild.name) //geht nicht bei message.channel.type = dm
            //log(message.guild.memberCount) //membercount //geht nicht bei message.channel.type = dm
            //log(message.channel.id) //geht nicht bei message.channel.type = dm
            //log(message.channel.name) //geht nicht bei message.channel.type = dm
        }
        else {
            sqlinsert.channel = { },
            sqlinsert.channel.id = 1
            sqlinsert.channel.name = client.user.username
            //log("message.channel.id = 1")
            //log(client.user.username)
        }
        //log("-----MESSAGE-----")
        sqlinsert.message = { }
        sqlinsert.message.id = message.id
        sqlinsert.message.cleanContent = message.cleanContent
        sqlinsert.message.WordCount = words
        //log(message.id)
        //log(message.cleanContent) // Will show the Message which was received.
        //log("-----CREATEDAT-----")
        sqlinsert.createdTimestamp = message.createdTimestamp
        sqlinsert.createdAt = message.createdAt
        //log(message.createdTimestamp) // timestamp
        //log(message.createdAt) // timestamp
        
        //log(sqlinsert)
        
        mongo.insertMongo("discord_log",sqlinsert,function (err,result){
        if (err) {
            log(`${chalk.red("CRITICAL ERROR")}\n` + err.stack)
        }
        if (result) {
            log("Mongo Insert: " + JSON.stringify(result.result) + " // " + JSON.stringify(result.ops, null))
        }
        });
    }; 

}

function WordCount(str) {
    return str.split(' ')
           .filter(function(n) { return n != '' })
           .length;
  }

exports.conf = {
    enabled: true,
    guildOnly: false,
    ShowHelp: false,
    Children: [ ],
    aliases: [`logmongo`],
    permLevel: 4
  };
  
  exports.help = {
    name : "logmongo",
    description: "This module is storing all messages of discord to mongo.\n",
    usage: "logmongo",
    example: `${config.prefix}logmongo`,
    description_detailed: "This module is storing all messages of discord to mongo.\n"
  };