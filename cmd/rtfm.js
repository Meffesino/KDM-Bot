const Discord = require("discord.js")
const config = require("../config.json");
exports.run = (client, message, args = []) => {
    const embed = new Discord.RichEmbed()
    .setTitle("RTFM")
    .setDescription(`While you walk through the dark, a huge, ornately-bound book lays open before the survivors. While they touched it, on a deep instinctual level, they knew that this is the Scribe's Book. The words which the Scribes writes came to reality. The rules came into existence with the strike of his quill. It seems to be the rulebook. If the survivors settlement has innovated **read** and the survivor has any courage, <@${message.author.id}> might roll for you and tell you your roll result.`)
    .setColor(0x97ECEA)
    .addField(`1`,'Everyone can deciphering the written word. Except you! Loose all courage, gain +100 insanity. You become so insane, that you hunt the legendary Mad Steed by your own in the next hunt phase. Proceed asking, but your settlement survivors might not help you.')
    .addField("2-7", `The book has a lot of pages. You try studying the written word to become a master. Everyone in the settlement respects your efforts. Gain +1 Courage when contacting <@${client.user.id}> per direct message and ask for ?help'. Follow instructions. When you mastered it, trigger the White Secret Story event.`)
    .addField("8", `You know the rulebook by heart, you passed already the White Secret Story Event. But you have left your book at settlement because your gear grid is full. Gain +3 insanity. You try to direct message <@${client.user.id}> and ask for '?help'`)
    .addField("9", `You have mastered the rulebook - you don't need it anymore. You have asked <@${client.user.id}> via ?FAQ and still failed. You are allowed to contact the glorious community in #rules . They might be able to help you.`)
    .addField("10", `You have insights of the world and it's behaviour, which even ${client.user.username} has not. You pay homage to all the support which were given to you while studying and let a moderator know your output, that ${client.user.username} can help a follow survivor the next time.`)
    .addField("11+", `The cult master will raise you up. You might become a new White Speaker.`)
    message.channel.send({embed});
  };
  
  exports.conf = {
    enabled: true, // not used yet
    guildOnly: false, // not used yet
    ShowHelp: false,
    Children: [ ],
    aliases: [`rtfm`],
    permLevel: 2 // Permissions Required, higher is more power
  };
  
  exports.help = {
    name : "rtfm",
    description: "Gives a great lore - explaining that you should read the rulebook.\nYou need moderator role to use this command. ",
    usage: "rtfm",
    example: `${config.prefix}help`,
    description_detailed: "It is showing all commands, which are available."
  };