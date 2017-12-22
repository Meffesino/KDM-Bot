const config = require("../config.json");
const Discord = require('discord.js');
const moment = require('moment');
const sql = require('../util/sql.js');
const help = require('./help')

exports.run = (client, message, args = []) => {
    let command = "faq"
    if(client.commands.has(command)) {
        command = client.commands.get(command);
    }
    if (args.length === 0) {
        help.run(client, message, [ 'faq' ] )
        return
    }
    
    var execute = "SELECT * FROM FAQ WHERE QUESTION LIKE '%" + [args[0]] + "%'"
    for (var i in args) {
        if (i != 0) {
        execute = execute + " AND QUESTION LIKE '%" + [args[i]] + "%'"
        }
    }
    execute = execute + " UNION SELECT * FROM FAQ WHERE ANSWER LIKE '%" + [args[0]] + "%'"
    for (var i in args) {
        if (i != 0) {
        execute = execute + " AND ANSWER LIKE '%" + [args[i]] + "%'" 
        }
    }
    
    sql.qry(execute, message, "FAQ", function(err, callback) {
        if (err) { 
            const embed = new Discord.RichEmbed()
            .setTitle("Error")
            .setDescription(`Error Code: ${err}\n\n Search: ${args[0]}`)
            .setColor(0xEF6E6E)
            .setFooter(`For more information: ${config.prefix}help ${command.help.name}`)
            message.channel.send({embed}).then(m => m.delete(config.deletetimererror));
        }
        if (callback) {
            if (callback.length === 0) { 
                const embed = new Discord.RichEmbed()
                .setTitle("Error in Request - nothing found")
                .setDescription(`Your request: **${config.prefix}${command.help.usage} ${args[0]}** has given no result.\nTry to change your request\n\nExample:\n          ${command.help.example}`)
                .setColor(0xEF6E6E)
                .setFooter(`For more information: ${config.prefix}help ${command.help.name}`)
                message.channel.send({embed}).then(m => m.delete(config.deletetimererror));
            }
            else if (callback.length <= 2) { // 1 hit! - Post results (callback) immediately.
                const embed = new Discord.RichEmbed()
                embed.setColor(0x97ECEA)
                embed.setTitle(`Results of "${args.join(' ')}"`)
                embed.setDescription(`${callback.length} results:`)
                for(i in callback) { // 1 hit! - Post results (callback) immediately.
                    if (i < 2) {
                        var lengthsum = callback[i].ANSWER.length + callback[i].SOURCE.length
                        if (lengthsum >= 1000) {
                            embed.addField(callback[i].QUESTION,`${callback[i].ANSWER.slice(0,1020)}`)
                            embed.addField(`[continue...]`,`${callback[i].ANSWER.slice(1020,2000)}\n\nSource:\n${callback[i].SOURCE}`)
                        }
                        else {
                            embed.addField(callback[i].QUESTION,`${callback[i].ANSWER}\n\nSource:\n${callback[i].SOURCE}`)
                        }
                    }
                }
                message.channel.send({embed});
            }
            else  {
                const embed = new Discord.RichEmbed()
                embed.setColor(0x97ECEA)
                embed.setTitle(`Results of "${args.join(' ')}"`)

                var x = `${callback.length} results:`
                var y = ""
                if (callback.length > 20) { var x = `20 of ${callback.length} results shown:` }
                embed.setDescription(x)
                for(i in callback) {
                  if (i < 20) {
                    embed.addField(`${config.prefix}fid ${callback[i].F_ID}`,`${callback[i].QUESTION}`)
                  }
                }
                embed.setFooter(`Use ${config.prefix}fid <ID> for the FAQ of the Keyword.`)
                message.channel.send({embed}).then(m => m.delete(config.deletetimerlist));
              }  
        }
    });
}; 

exports.conf = {
  enabled: true,
  guildOnly: false,
  ShowHelp: true,
  Children: [ 'fid' ],
  aliases: [ 'f' ],
  permLevel: 0
};

exports.help = {
  name : "faq",
  description: "This command will search the FAQ (Questions and Answers!). It contains the official FAQ and community added topics\n",
  usage: "faq",
  example: `${config.prefix}f <keywords>\n\n    ${config.prefix}f gear copies\n\nResults:\n    Can you craft more copies of a gear card than come in the Core Game?\n    Of course! Only unique gear is limited.\n\nWhen more results occure, a list will be shown. You can further dig into each results by using the ID_number with '${config.prefix}fid <ID>'\n `,
  description_detailed: "This command will search the FAQ (Questions and Answers!). It contains the official FAQ and community added topics"
};

