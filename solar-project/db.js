const mysql = require('mysql');
const util = require('util');
require('dotenv').config({ path: process.env.pro ? '.env' : '.env.dev' });

const conn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const query = util.promisify(conn.query).bind(conn);

module.exports = {
    conn,
    query,
}