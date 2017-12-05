const reqEvent = (event) => require(`../events/${event}`);
module.exports = client => {
  //client.on('debug', () => reqEvent('debug')()); // Debuging
 // client.on('disconnect', (e) => reqEvent('disconnect'));
  //client.on('error', e => reqEvent('error'));
  client.on('guildCreate', () => reqEvent('guildCreate')); // This event triggers when the bot joins a guild.
  client.on('guildDelete', () => reqEvent('guildDelete')); // This event triggers when the bot is removed a guild.
  client.on('ready', () => reqEvent('ready')(client));
 // client.on('reconnecting', (e) => reqEvent('reconnecting'));
//client.on('warn', (e) => reqEvent('warn'));
};
