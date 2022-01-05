const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

let connection = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database: process.env.MYSQL_DATABASE,
});

module.exports = connection;
