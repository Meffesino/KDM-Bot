const moment = require('moment');
const chalk = require('chalk');

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
  };

module.exports = Client => { 
    console.log("Sending a heartbeat")
    console.log(Client)
   /* if (client.indexOf("Sending a heartbeat") == -1 ) { //reducing spamming of debug. But still shows the latency.
        log(chalk.gray("DEBUG", client));
    }  
    */
};
