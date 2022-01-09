const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.post('/users', (req, res) => {
	let sqlUser = `
        SELECT *
        FROM users
        WHERE user_email = ?
        AND user_password = ?
    `;

	let valuesUser = [req.body.user, req.body.password];

	connection.query(sqlUser, valuesUser, (err, result, fields) => {
		if (err) {
			res.status(500).send({
				message: 'Error in the request to the database',
			});
		} else {
			if (result.length > 0) {
				res.send(result);
			} else {
				res.status(404).send({
					message: 'User or password incorrect',
				});
			}
		}
	});
});

router.delete('/', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.json({
				status: 'Error',
				message: 'Error trying to log out. Try again later.',
			});
		} else {
			res.clearCookie('Alkemy Fullstack Challenge');
			res.json({
				status: 'Success',
				message: 'Logged out successfully.',
			});
		}
	});
});
