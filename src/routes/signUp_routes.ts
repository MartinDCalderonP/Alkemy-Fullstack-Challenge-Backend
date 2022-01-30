import express from 'express';
import connection from '../connection';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/users', (req, res) => {
	const sqlCheckUser = `
		SELECT *
		FROM users
		WHERE user_email = ?
		AND user_password = ?
	`;

	const valuesCheckUser = [req.body.email, req.body.password];

	connection.query(sqlCheckUser, valuesCheckUser, (err, result) => {
		if (err) {
			return res.json({
				status: 'Error',
				message:
					'Error when trying to check if user already exists. Please try again.',
			});
		}

		if (result.length > 0) {
			return res.json({
				status: 'Error',
				message: 'User already exists.',
			});
		}

		const sqlSignUpUser = `
			INSERT INTO Users (
				user_name,
				user_email,
				user_password
			) VALUES (
				?,
				?,
				?
			)
		`;

		const valuesSingUpUser = [req.body.name, req.body.email, req.body.password];

		connection.query(sqlSignUpUser, valuesSingUpUser, (err) => {
			if (err) {
				return res.json({
					status: 'Error',
					message: 'Error when trying to sign up a new user. Please try again.',
				});
			}

			const sqlSignInUser = `
					SELECT *
					FROM users
					WHERE user_email = ?
					AND user_password = ?
				`;

			const valuesSignInUser = [req.body.email, req.body.password];

			connection.query(sqlSignInUser, valuesSignInUser, (err, result) => {
				if (err) {
					return res.json({
						status: 'Error',
						message:
							'Error when trying to sign in after sign up a new user. Please try again.',
					});
				}

				if (result.length > 0 && process.env.JWT_SECRET) {
					const userForToken = {
						id: result[0].user_id,
						name: result[0].user_name,
						email: result[0].user_email,
					};

					const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
						expiresIn: '1h',
					});

					return res.json({
						status: 'Success',
						message: 'User signed up successfully.',
						user: result[0],
						token: token,
					});
				}

				return res.json({
					status: 'Error',
					message:
						'Error when trying to sign in after sign up a new user. Please try again.',
				});
			});
		});
	});
});

export default router;
