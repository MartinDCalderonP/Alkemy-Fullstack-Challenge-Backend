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

	let valuesUser = [req.body.email, req.body.password];

	connection.query(sqlUser, valuesUser, (err, result, fields) => {
		if (err) {
			res.json({
				status: 'Error',
				message: 'Error when trying to login. Please try again.',
			});
		} else {
			if (result.length > 0) {
				req.session.user = result[0];

				res.json({
					status: 'Success',
					message: 'Login successful.',
					user: result[0],
				});
			} else {
				res.json({
					status: 'Error',
					message: 'Invalid email or password.',
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

module.exports = router;
