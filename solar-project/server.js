const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const cors = require('cors');
const db = require('./sql_db');
const mongo = require('./mongo');
const app = express();


/**
 * Load environment variables from .env file.
 */
require('dotenv').config({ path: process.env.pro ? '.env' : '.env.dev' });
const log = require('Debug')('app');

log(process.env.pro ? chalk.red('Production Mode') : chalk.yellow('Development Mode'));

//set secret
app.set('Secret', process.env.SECRET);
app.set('view engine', 'ejs');


let state_cache;
async function get_mongo_conn() {
    let conn = await mongo.conn();
    //initalize
    state_cache = await (new mongo.MongoCache(conn, { time_to_live: 1 })).init();
    return conn;
}


let mongo_conn = (async () => await get_mongo_conn())();



db.conn.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
        log(error);
        log(chalk.red(`
Mysql connection error. Please make sure Mysql is running. And following step is done
1. Create a database name 'solar_project'
    mysql -u {USERNAME} -p # This will bring you into the MySQL shell prompt. Next, create a new database with the following command
    mysql> CREATE DATABASE solar_project;
    mysql> exit;
2. unzip the ./artifacts/solar_project.zip
3. Run 'mysql -u {USERNAME} -p solar_project < ./artifacts/solar_project.sql'    
`));
        process.exit();
    }
});

/**
 * log only 4xx and 5xx responses to console
 * log all requests to access.log
 */
app.use(morgan('dev', { skip: (req, res) => res.statusCode < 400 }));
app.use(morgan('common', { stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) }));
app.use(express.static(__dirname + '/public'));

//https://stackoverflow.com/questions/20035101/why-does-my-javascript-code-get-a-no-access-control-allow-origin-header-is-pr
// allow access from any where
app.use(cors());

// index page
app.get('/', async function(req, res) {

    res.render('pages/index', {data: {}});
});


app.listen(process.env.PORT, () => {
    log(chalk.bold('Server is up and running on ' + process.env.BASE_URL));
});