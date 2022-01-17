const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.post('/users', (req, res) => {
	const sqlCheckUser = `
		SELECT *
		FROM users
		WHERE user_email = ?
		AND user_password = ?
	`;

	const valuesCheckUser = [req.body.email, req.body.password];

	connection.query(sqlCheckUser, valuesCheckUser, (err, result, fields) => {
		if (err) {
			res.json({
				status: 'Error',
				message:
					'Error when trying to check if user already exists. Please try again.',
			});
		} else {
			if (result.length > 0) {
				res.json({
					status: 'Error',
					message: 'User already exists.',
				});
			} else {
				const sqlSignUpUser = `
					INSERT INTO Users (
						user_email,
						user_password
					) VALUES (
						?,
						?
					)
				`;

				const valuesSingUpUser = [req.body.email, req.body.password];

				connection.query(
					sqlSignUpUser,
					valuesSingUpUser,
					(err, result, fields) => {
						if (err) {
							res.json({
								status: 'Error',
								message:
									'Error when trying to sign up a new user. Please try again.',
							});
						} else {
							res.json({
								status: 'Success',
								message: 'User signed up successfully.',
							});

							const sqlSignInUser = `
								SELECT *
								FROM users
								WHERE user_email = ?
								AND user_password = ?
							`;

							const valuesSignInUser = [
								req.body.email,
								req.body.password,
							];

							connection.query(
								sqlSignInUser,
								valuesSignInUser,
								(err, result, fields) => {
									if (err) {
										res.json({
											status: 'Error',
											message:
												'Error when trying to sign in. Please try again.',
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
								}
							);
						}
					}
				);
			}
		}
	});
});

module.exports = router;
