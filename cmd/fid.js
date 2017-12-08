const config = require("../config.json");
const Discord = require('discord.js');
const moment = require('moment');
const sql = require('../util/sql.js');
const help = require('./help')



exports.run = (client, message, args = []) => {
    let command = "fid"
        if(client.commands.has(command)) {
        command = client.commands.get(command);
    }
    if (args.length === 0) {
        help.run(client, message, [ 'fid' ])
        return
    }

    
    sql.qry("SELECT * FROM FAQ WHERE F_ID = '" + [args[0]] + "'", message, "FAQ", function(err, callback) {
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
                .setTitle(callback[0].QUESTION)
                .setDescription(callback[0].ANSWER)
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
  name : "fid",
  description: "Resulting Questions and Answers of the FAQ database, which contains the official FAQ and community added topics, but the internal saved ID is needed.\n",
  usage: "fid",
  example: `${config.prefix}fid <id>\n          ${config.prefix}fid 43\n\nResults: \n   Can you craft more copies of a gear card than come in the Core Game?\n   Of course! Only unique gear is limited.  `,
  description_detailed: "Resulting Questions and Answers of the FAQ database, which contains the official FAQ and community added topics, but the internal saved ID is needed.\n\nSome search in the FAQ using the main command will have multiple results. It shows the ID, which you can use to detail your search further more."
};

