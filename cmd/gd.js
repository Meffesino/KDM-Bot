const config = require("../config.json");
const Discord = require('discord.js');
const moment = require('moment');
const sql = require('../util/sql.js');
const help = require('./help')



exports.run = (client, message, args = []) => {
    let command = "gd"    
        if(client.commands.has(command)) {
        command = client.commands.get(command);
    }
    if (args.length === 0) {
        help.run(client, message, [ 'gd' ] )
        return
    }

    //AND DESCRIPTION LIKE '%" + [args[1]] + "%' AND DESCRIPTION LIKE '%" + [args[2]] + "%' AND DESCRIPTION LIKE '%" + [args[3]] + "%' AND DESCRIPTION LIKE '%" + [args[4]] + "%'"
    var execute = "SELECT * FROM Glossary WHERE DESCRIPTION LIKE '%" + [args[0]] + "%'"
    for (var i in args) {
        if (i != 0) {
        execute = execute + " AND DESCRIPTION LIKE '%" + [args[i]] + "%'" 
        }
    }
    
    sql.qry(execute, message, "Glossary", function(err, callback) {
        if (err) { 
            message.channel.send(`**Error** Search "${args[0]} results in" ${err.code}`) 
        }
        if (callback) {
            if (callback.length === 0) { 
                let redirect = message.content.split(" ")[0].slice(config.prefix.length).toLowerCase();

                const embed = new Discord.RichEmbed()
                if (redirect !== "gd") {
                    embed.setTitle("Error in Request - nothing found. Neither in ?g (keywords) nor in ?gd (description)")   
                }
                else { 
                    embed.setTitle("Error in Request - nothing found.")  
                }
                embed.setDescription(`Your request: **${config.prefix}${command.help.usage} ${args}** has given no result.\nTry to change your request\n\nExample:\n          ${command.help.example}`)                .setColor(0xEF6E6E)
                embed.setFooter(`For more information: ${config.prefix}help ${command.help.name}`)
                message.channel.send({embed}).then(m => m.delete(config.deletetimer));
            }
            else if (callback.length <= 3) { // 1 hit! - Post results (callback) immediately.
                const embed = new Discord.RichEmbed()
                embed.setColor(0x97ECEA)
                embed.setTitle(`Results of "${args}"`)
                embed.setDescription(`${callback.length} results:`)
                for(i in callback) { // 1 hit! - Post results (callback) immediately.
                    if (i < 3) {
                        embed.addField(callback[i].TOPIC,`${callback[i].DESCRIPTION}\nSource: ${callback[i].SOURCE}`)
                  }
                }
                message.channel.send({embed});
            }
            else  {
                const embed = new Discord.RichEmbed()
                embed.setColor(0x97ECEA)
                embed.setTitle(`Results of "${args}"`)
                embed.setDescription('')
                var x = `${callback.length} results:`
                var y = ""
                if (callback.length > 20) { var x = `20 of ${callback.length} results shown:` }
                for(i in callback) {
                  if (i < 20) {
                    var y = y + `${config.prefix}gid ${callback[i].G_ID}\t **${callback[i].TOPIC}**\n`
                  }
                }
                embed.addField(x,y)
                embed.setFooter(`Use ${config.prefix}gid <ID> for the description of the Keyword.`)
                message.channel.send({embed}).then(m => m.delete(config.deletetimer));
              }  
        }
    });
}; 

exports.conf = {
  enabled: true,
  guildOnly: false,
  ShowHelp: false,
  Children: [ ],
  aliases: [ ],
  permLevel: 0
};

exports.help = {
  name : "gd",
  description: "This command will search in the description of the glossary. This can be used, to find specific sections or cross-references\n",
  usage: "gd",
  example: `${config.prefix}gd <items>\n          ${config.prefix}Survival opportunity\n\nResult 3 Items:\n     ?gid 91 - Dash\n     ?gid 132 - Flow\n     ?gid 316 - Surg\n\nYou can further dig into each results by using the ID_number with '${config.prefix}gid <ID>'\n `,
  description_detailed: "This command will search in the description of the glossary. This can be used, to find specific sections or cross-references"
};

