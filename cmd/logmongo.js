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
        var query = { }
        query.type = message.channel.type
        query.author = { }
        query.author.id = message.author.id
        query.author.username = message.author.username
        if (message.channel.type == 'text') {
            query.guild = { }
            query.guild.id = message.guild.id
            query.guild.name = message.guild.name
            query.guild.memberCount = message.guild.memberCount
            query.channel = { },
            query.channel.id = message.channel.id
            query.channel.name = message.channel.name
            //get parent ID and name
            parentID = message.channel.parentID
            parentName = message.guild.channels.filter(i => i.id == parentID).map(i => i.name)[0]
            if(typeof parentName !== "undefined") {
                query.channel.parentID = parentID
                query.channel.parentName = parentName
            }

        }
        else {
            query.channel = { },
            query.channel.id = 1
            query.channel.name = client.user.username

        }

        query.message = { }
        query.message.id = message.id
        query.message.cleanContent = message.cleanContent
        query.message.WordCount = words
        query.createdTimestamp = message.createdTimestamp
        query.createdAt = message.createdAt

        
        //log(query)
        
        mongo.insertMongo("discord_log",query,function (err,result){
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