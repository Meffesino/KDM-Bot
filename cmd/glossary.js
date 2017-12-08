const config = require("../config.json");
const Discord = require('discord.js');
const moment = require('moment');
const sql = require('../util/sql.js');
const help = require('./help')
const gd = require('./gd')



exports.run = (client, message, args = []) => {
    let command = "glossary"
    if(client.commands.has(command)) {
        command = client.commands.get(command);
    }
    if (args.length === 0) {
        help.run(client, message, [ 'glossary' ] )
        return
    }

    //AND DESCRIPTION LIKE '%" + [args[1]] + "%' AND DESCRIPTION LIKE '%" + [args[2]] + "%' AND DESCRIPTION LIKE '%" + [args[3]] + "%' AND DESCRIPTION LIKE '%" + [args[4]] + "%'"
    var execute = "SELECT * FROM Glossary WHERE TOPIC LIKE '%" + [args[0]] + "%'"
    for (var i in args) {
        if (i != 0) {
        execute = execute + " AND TOPIC LIKE '%" + [args[i]] + "%'" 
        }
    }
    
    sql.qry(execute, message, "Glossary", function(err, callback) {
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
                gd.run(client, message, args);
            }
            else if (callback.length <= 3) { // 1 hit! - Post results (callback) immediately.
                const embed = new Discord.RichEmbed()
                embed.setColor(0x97ECEA)
                embed.setTitle(`Results of "${args}"`)
                embed.setDescription(`${callback.length} results:`)
                for(i in callback) { // 1 hit! - Post results (callback) immediately.
                    if (i < 3) {
                        embed.addField(callback[i].TOPIC,`${callback[i].DESCRIPTION}\n\nSource: ${callback[i].SOURCE}`)
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
  ShowHelp: true,
  Children: [ 'gid', 'gd' ],
  aliases: [ 'g' ],
  permLevel: 0
};

exports.help = {
  name : "glossary",
  description: "This command will search in the description of the glossary (Keyword search only!). This can be used, to find specific sections or cross-references\n",
  usage: "glossary",
  example: `${config.prefix}g <keywords>\n\n    ${config.prefix}g Survival opportunity\n\nResults:\n    Bash\n    Cause survivors to be knocked down.\n\nWhen more results occure, a list will be shown. You can further dig into each results by using the ID_number with '${config.prefix}gid <ID>'\n `,
  description_detailed: "This command will search in the description of the glossary. This can be used, to find specific sections or cross-references"
};

