const config = require("../config.json");
const Discord = require('discord.js');
const moment = require('moment');
const sql = require('../util/sql.js');
const help = require('./help')
const fs = require("fs");

exports.run = (client, message, args = []) => {
    
    let command = "card"
    if(client.commands.has(command)) {
        command = client.commands.get(command);
    }
    if (args.length === 0) {
        help.run(client, message, [ 'card' ] )
        return
    }
    
    var execute = "SELECT * FROM Cards WHERE NAME LIKE '%" + [args[0]] + "%'"
    for (var i in args) {
        if (i != 0) {
        execute = execute + " AND NAME LIKE '%" + [args[i]] + "%'"
        }
    }


    sql.qry(execute, message, "Cards", function(err, callback) {
        if (err) { 
            const embed = new Discord.RichEmbed()
            .setTitle("Error in cards")
            .setDescription(`Error Code: ${err}\n\n Search: ${args[0]}`)
            .setColor(0xEF6E6E)
            //.addField("Error Detail", err)
            .setFooter(`For more information: ${config.prefix}help ${command.help.name}`)
            message.channel.send({embed}).then(m => m.delete(config.deletetimererror));
        }
        if (callback) {
            const embed = new Discord.RichEmbed()
            if (callback.length === 0) { 
                embed.setTitle("Error in Request - nothing found")
                embed.setDescription(`Your request: **${config.prefix}${command.help.usage} ${args[0]}** has given no result.\nTry to change your request\n\nExample:\n    ${command.help.example}`)
                embed.setColor(0xEF6E6E)
                embed.setFooter(`For more information: ${config.prefix}help ${command.help.name}`)
                message.channel.send({embed}).then(m => m.delete(config.deletetimererror));
            }
            else if (callback.length === 1) { // 1 hit! - Post results (callback) immediately.
                if (callback[0].FILELOCATION === null) {
                    embed.setTitle("This story has not yet been written so it cannot be told.")
                    embed.setDescription(`Try again when the pages are updated.`)
                    embed.setColor(0xEF6E6E)
                    message.channel.send({embed}).then(m => m.delete(config.deletetimererror));
                    return;
                }
                 fs.access(__dirname + `/../${callback[0].FILELOCATION}`, fs.constants.R_OK, (err) => {
                    if (err) {
                        embed.setTitle("Error in cards")
                        embed.setDescription(`Error Code: ${err.code}`)
                        embed.setColor(0xEF6E6E)
                        embed.addField("Potential Error:", "No Access?")
                        embed.setFooter(`Please contact a Moderator with your request to the bot to fix this problem`)
                        message.channel.send({embed}).then(m => m.delete(config.deletetimererror));
                        return;
                      }
                      embed.setTitle(`${callback[0].GROUP} (${callback[0].SUBGROUP}) - ${callback[0].NAME}`)
                      embed.setColor(0x97ECEA)
                      embed.attachFile(__dirname + `/../${callback[0].FILELOCATION}`)
                      message.channel.send({embed}).then(m => m.delete(config.deletetimerimage));
                  });
            }
            else  {
                embed.setColor(0x97ECEA)
                embed.setTitle(`Results of "${args.join(' ')}"`)
                embed.setDescription('')
                var x = `${callback.length} results:`
                var y = ""
                if (callback.length > 20) { var x = `20 of ${callback.length} results shown:` }
                for(i in callback) {
                    if (i < 20) {
                      var y = y + `${config.prefix}c ${callback[i].NAME}\n`
                    }
                }
                embed.addField(x,y)
                embed.setFooter(`Detail your request. Example: ${config.prefix}c ${callback[0].NAME}`)
                message.channel.send({embed}).then(m => m.delete(config.deletetimerlist));
              }  
        }
    });


}; 

exports.conf = {
  enabled: true,
  guildOnly: false,
  ShowHelp: true,
  Children: [ 'cid' ],
  aliases: [ 'c', 'cards' ],
  permLevel: 0
};

exports.help = {
  name : "card",
  description: "This command will show for a limited time the requested card. \n",
  usage: "card",
  example: `${config.prefix}c <card name>\n\n    ${config.prefix}c Bone Dagger" `
};

