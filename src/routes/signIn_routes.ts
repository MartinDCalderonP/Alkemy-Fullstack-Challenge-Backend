import express from 'express';
import connection from '../connection';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/users', (req, res) => {
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
				message: 'Error when trying to sign in. Please try again.',
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
				message: 'Sign in successful.',
				user: result[0],
				token: token,
			});
		}

		return res.json({
			status: 'Error',
			message: 'Invalid email or password.',
		});
	});
});

router.delete(
	'/',
	(
		req: { session: { destroy: (response: (err: Error) => void) => void } },
		res: {
			json: (response: { status: string; message: string }) => void;
			clearCookie: (cookie: string) => void;
		}
	) => {
		req.session.destroy((err) => {
			if (err) {
				return res.json({
					status: 'Error',
					message: 'Error trying to sign out. Try again later.',
				});
			}

			res.clearCookie('Alkemy Fullstack Challenge');

			return res.json({
				status: 'Success',
				message: 'User signed out successfully.',
			});
		});
	}
);

export default router;
