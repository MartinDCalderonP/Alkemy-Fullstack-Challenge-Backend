import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database: process.env.MYSQL_DATABASE,
});

connection.getConnection((err) => {
	if (err) {
		console.log(err);
		return;
	}

	console.log('DB is connected');
});

export default connection;
