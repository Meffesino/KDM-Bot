const mysql = require('mysql');
const config = require("../config.json"); // Here we load the config.json file that contains our token and our prefix values. 
const prefix = config.prefix //loading the prefix set in the config file
const moment = require('moment');
const Discord = require('discord.js');
const chalk = require('chalk');

module.exports.qry = qry; //to trigger the query command, Querry, message, table needed. Callback error / result.
module.exports.simpleqry = simpleqry; //trigger the query command, only querry needed. Callback error / result.

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

// SQL Query execution.

function qry(execute, message, table, callback) { //execute = SQL Command
  var query = pool.query(execute, function(error, results, fields) {
    console.log(query.sql)
    var userid = message.author.id
    var username = message.author.username
    if (error) {
      console.log("ERROR - SQL.JS")
      var resultslength = `ERROR: ${error.code}`
      error = error.code
    }  
    if (results) {
      var resultslength = results.length      
    }
    callback(error, results) // error and results will be send back
    log(chalk.bgWhite.gray(`${chalk.blueBright.bold(`SQL:`)} ${username}  :  '${message.content}'   RESULTS: ${chalk.blueBright.bold(resultslength)}`))    
    sqllog(userid, username, table, query.sql, resultslength);
  })
};

//Saving Log for Statistics and Analysis into a Log Table on DB:
function sqllog(userid, username, table, sqlqry, resultslength) {
  var sql = "INSERT INTO SQLLog (USERID, USERNAME, SEARCHTABLE, SQLQRY, RESULTS) VALUES (?)";
  var values = [ userid, username, table, sqlqry, resultslength, ];
  pool.query(sql, ([values]), function(err) {
    if (err) {
      log(chalk.bgYellow(`Error in "SQLLOG": ${err.code}`))
    }
  });
};

function simpleqry(execute, callback) {
  var qry = pool.query(execute, function(error, results, fields) {
      //console.log(qry.sql)
      if (error) {
          var resultslength = `ERROR: ${error.code}`
          error = error.code
      }  
      callback(error, results) // error and results will be send back
  })
};

var pool  = mysql.createPool({
  host: `${config.host}`, 
  user: `${config.user}`,
  password: `${config.password}`,
  database: `${config.database}`
});



