const config = require("../config.json");
const Discord = require('discord.js');
const moment = require('moment');
const sql = require('../util/sql.js');
const help = require('./help')

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
            .setDescription(`Error Code: ${err.code}\n\n Search: ${args[0]}`)
            .setColor(0xEF6E6E)
            .addField("Error Detail", err)
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
            else if (callback.length === 1) { // 1 hit! - Post results (callback) immediately.
                const embed = new Discord.RichEmbed()
                .setTitle(`${callback[0].GROUP} (${callback[0].SUBGROUP}) - ${callback[0].NAME}`)
                .setColor(0x97ECEA)
                .attachFile(__dirname + `/../${callback[0].FILELOCATION}`)
                message.channel.send({embed}).then(m => m.delete(config.deletetimer));
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
                      var y = y + `${config.prefix}c ${callback[i].NAME}\n`
                    }
                }
                embed.addField(x,y)
                embed.setFooter(`Detail your request. Example: ${config.prefix}c ${callback[0].NAME}`)
                message.channel.send({embed}).then(m => m.delete(config.deletetimer));
              }  
        }
    });




// ADD LOG

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
  example: `${config.prefix}c <card name>\n\n    ${config.prefix}c Bone Dagger\n\nResults:\n   <picture of card>" `
};

