// To send a DM to a person - inform him, that he can direct message the bot instead of spamming the main channel.
const Discord = require("discord.js")
const config = require("../config.json");
const moment = require('moment');
const chalk = require('chalk');
const help = require('./help')

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
  };

exports.run = (client, message, args = []) => {
    let command = "dm"
    if(client.commands.has(command)) {
        command = client.commands.get(command);
    }
    if (args.length === 0) {
        help.run(client, message, [ 'dm' ] )
        return
    }
    
        var id;

    //if (typeof args[0] !== 'undefined' && args[0] !== null) { 
    if ((args[0].indexOf("@") > 0) && (args[0].indexOf(">") > 0)) { // get the id and proofcheck if user is available.
        id = args[0].split("@")
        id = id[1].split(">").shift()
        if (typeof client.users.get(id) !== 'undefined' && client.users.get(id)) { 
            const embed = new Discord.RichEmbed()
            .setTitle("Murder")
            .setDescription(`-Settlement Event-\nSorry to disrup you, but you disrup all others! Therefore you trigger the special settlement event:`)
            .setColor(0xEF6E6E)
            .addField(`Story`,`Someone in the settlement has been murdered! All non-deaf survivors, especially <@${message.author.id}> are the victims. The murder - the survivor with the highest disturbance rate ${args[0]} - was caught in the act. Roll 1d10 on the society table below`)
            .addField("1", `The murderer is proceeding disturbing the other survivors. The murderer is slaughtered and their blod is painted onto the bodies of the survivors, empowering them. They gain +2 survival and enjoy the silence.`)
            .addField("2-3", `The murder is ignoring the whisper of <@${client.user.id}> and gets banished from the settlement when proceed disrupting.`)
            .addField("4-9", `The murder realized to **use this chat for all commands which are not required to discuss with others survivors in the settlement**. He whispers to the direct message channel with <@${client.user.id}> by asking all questions he has. And he will get answered`)
            .addField("10", `The murder is heralded as the fiercest warrior in the settlement, after he says "sorry" to the settlement channel... He realize to use the direct message with <@${client.user.id}> to whisper all questions from now on! Congratulation!`)
        client.users.get(id).send({embed}) //get id before!

        log(chalk.bgWhite.gray(`${chalk.blueBright.bold(`dm`)} to ${client.users.get(id).username} by ${message.author.username}`));
        }
        else { 
            log(chalk.bgWhite.gray(`${chalk.blueBright.bold(`dm`)} ${chalk.redBright.bold(`ERROR`)} to ${args} by ${message.author.username}`));
        }
    }
    else { 
        const embed = new Discord.RichEmbed()
        .setTitle("Error: Change your request")
        .setDescription(`Example: ${command.help.example}`)
        .setColor(0xEF6E6E)
        .setFooter(`For more information: ${config.prefix}help ${command.help.name}`)
        message.channel.send({embed}).then(m => m.delete(config.deletetimer));
    }
};
  
  exports.conf = {
    enabled: true, // not used yet
    guildOnly: false, // not used yet
    ShowHelp: false,
    Children: [ ],
    aliases: [ ],
    permLevel: 2 // Permissions Required, higher is more power
  };
  
  exports.help = {
    name : "dm",
    description: "Bot sends a message to a person to inform him to use the private chat instead the public channel.- only available for permission level 2+",
    usage: "dm",
    example: `${config.prefix}dm @Meffesino`,
    description_detailed: "Bot sends a message to a person to inform him to use the private chat instead the public channel.- only available for permission level 2+"
  };