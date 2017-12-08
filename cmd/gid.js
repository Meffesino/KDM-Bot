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
        if (err) { 
            const embed = new Discord.RichEmbed()
            .setTitle("Error")
            .setDescription(`Error Code: ${err.code}\n\n Search: ${args[0]}`)
            .setColor(0xEF6E6E)
            .setFooter(`For more information: ${config.prefix}help ${command.help.name}`)
            message.channel.send({embed}).then(m => m.delete(config.deletetimer));
        }
        if (callback) {
            if (callback.length === 0) { 
                const embed = new Discord.RichEmbed()
                .setTitle("Error in Request - nothing found")
                .setDescription(`Your request: **${config.prefix}${command.help.usage} ${args[0]}** has given no result.\nTry to change your request\n\nExample:\n          ${command.help.example}`)
                .setColor(0xEF6E6E)
                .setFooter(`For more information: ${config.prefix}help ${command.help.name}`)
                message.channel.send({embed}).then(m => m.delete(config.deletetimer));
            }
            if (callback.length === 1) { // 1 hit! - Post results (callback) immediately.
                const embed = new Discord.RichEmbed()
                .setTitle(callback[0].TOPIC)
                .setDescription(callback[0].DESCRIPTION)
                .setColor(0x97ECEA)
                .setFooter(`Source: ${callback[0].SOURCE}`)
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

