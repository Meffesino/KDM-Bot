const config = require("../config.json");
const Discord = require('discord.js');
const moment = require('moment');
const sql = require('../util/sql.js');
const help = require('./help')



exports.run = (client, message, args = []) => {
    let command = "gid"
        if(client.commands.has(command)) {
        command = client.commands.get(command);
    }
    if (args.length === 0) {
        help.run(client, message, [ 'gid' ])
        return
    }

    
    sql.qry("SELECT * FROM Glossary WHERE G_ID = '" + [args[0]] + "'", message, "Glossary", function(err, callback) {
        const embed = new Discord.RichEmbed()
        if (err) { 
            embed.setTitle("Error")
            embed.setDescription(`Error Code: ${err}\n\n Search: ${args[0]}`)
            embed.setColor(0xEF6E6E)
            embed.setFooter(`For more information: ${config.prefix}help ${command.help.name}`)
            message.channel.send({embed}).then(m => m.delete(config.deletetimererror));
        }
        if (callback) {
            if (callback.length === 0) { 
                embed.setTitle("Error in Request - nothing found")
                embed.setDescription(`Your request: **${config.prefix}${command.help.usage} ${args[0]}** has given no result.\nTry to change your request\n\nExample:\n          ${command.help.example}`)
                embed.setColor(0xEF6E6E)
                embed.setFooter(`For more information: ${config.prefix}help ${command.help.name}`)
                message.channel.send({embed}).then(m => m.delete(config.deletetimererror));
            }
            if (callback.length === 1) { // 1 hit! - Post results (callback) immediately.

                for(i in callback) { // 1 hit! - Post results (callback) immediately.
                    if (i < 3) {
                        var lengthsum = callback[i].DESCRIPTION.length + callback[i].SOURCE.length
                        if (lengthsum >= 1000) {
                            embed.addField(callback[i].TOPIC,`${callback[i].DESCRIPTION.slice(0,1020)}`)
                            embed.addField(`[...]${callback[i].TOPIC}`,`${callback[i].DESCRIPTION.slice(1020,2000)}\n\nSource: ${callback[i].SOURCE}`)
                        }
                        else {
                            embed.addField(callback[i].TOPIC,`${callback[i].DESCRIPTION}\n\nSource: ${callback[i].SOURCE}`)
                        }
                    }
                }
                embed.setColor(0x97ECEA)
                /*
                embed.setTitle(callback[0].TOPIC)
                embed.setDescription(callback[0].DESCRIPTION)
         
                embed.setFooter(`Source: ${callback[0].SOURCE}`)
                  */     
                message.channel.send({embed});
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
  name : "gid",
  description: "Deliver the Keyword and Description of the KD:M Glossary 1.5 - based on the internal saved ID\n",
  usage: "gid",
  example: `${config.prefix}gid <id>\n          ${config.prefix}gid 47\n\nResults: \n   Bash\n   Cause survivors to be knocked down.  `,
  description_detailed: "Deliver the Keyword and Description of the KD:M Glossary 1.5 - based on the internal saved ID\nSome search in the glossary using the main command will have multiple results. It shows the ID, which you can use to detail your search further more."
};

