const moment = require('moment');
const chalk = require('chalk');
const path = require('path');
const mongo = require('../util/mongo.js');
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
        sqlinsert.type = message.channel.type
        sqlinsert.author = { }
        sqlinsert.author.id = message.author.id
        sqlinsert.author.username = message.author.username
        if (message.channel.type == 'text') {
            sqlinsert.guild = { }
            sqlinsert.guild.id = message.guild.id
            sqlinsert.guild.name = message.guild.name
            sqlinsert.guild.memberCount = message.guild.memberCount
            sqlinsert.channel = { },
            sqlinsert.channel.id = message.channel.id
            sqlinsert.channel.name = message.channel.name
            //get parent ID and name
            parentID = message.channel.parentID
            parentName = message.guild.channels.filter(i => i.id == parentID).map(i => i.name)[0]
            if(typeof parentName !== "undefined") {
                sqlinsert.channel.parentID = parentID
                sqlinsert.channel.parentName = parentName
            }

        }
        else {
            sqlinsert.channel = { },
            sqlinsert.channel.id = 1
            sqlinsert.channel.name = client.user.username

        }

        sqlinsert.message = { }
        sqlinsert.message.id = message.id
        sqlinsert.message.cleanContent = message.cleanContent
        sqlinsert.message.WordCount = words
        sqlinsert.createdTimestamp = message.createdTimestamp
        sqlinsert.createdAt = message.createdAt

        
        //log(sqlinsert)
        
        mongo.insertMongo("discord_log",sqlinsert,function (err,result){
        if (err) {
            log(`${chalk.red("CRITICAL ERROR")}\n` + err.stack)
        }
        if (result) {
            //log("Mongo Insert: " + JSON.stringify(result.result) + " // " + JSON.stringify(result.ops, null))
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