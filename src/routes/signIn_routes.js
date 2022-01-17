const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.post('/users', (req, res) => {
	const sqlSignInUser = `
        SELECT *
        FROM users
        WHERE user_email = ?
        AND user_password = ?
    `;

	const valuesSignInUser = [req.body.email, req.body.password];

	connection.query(sqlSignInUser, valuesSignInUser, (err, result, fields) => {
		if (err) {
			res.json({
				status: 'Error',
				message: 'Error when trying to sign in. Please try again.',
			});
		} else {
			if (result.length > 0) {
				req.session.user = result[0];

				res.json({
					status: 'Success',
					message: 'Sign in successful.',
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
				message: 'Error trying to sign out. Try again later.',
			});
		} else {
			res.clearCookie('Alkemy Fullstack Challenge');
			res.json({
				status: 'Success',
				message: 'User signed out successfully.',
			});
		}
	});
});

module.exports = router;
