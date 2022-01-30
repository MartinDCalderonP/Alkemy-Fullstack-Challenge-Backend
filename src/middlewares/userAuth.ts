import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export default function userAuth(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!process.env.JWT_SECRET) {
		return res.json({
			status: 'Error',
			message: 'Secret is not set.',
		});
	}

	const authorization = req.get('Authorization');

	const token =
		authorization?.startsWith('Bearer ') && authorization?.split(' ')[1];

	if (token) {
		try {
			jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return res.json({
				status: 'Error',
				message: 'No token provided or invalid.',
			});
		}
	}

	const decodedToken = token && jwt.verify(token, process.env.JWT_SECRET);

	if (!decodedToken) {
		return res.json({
			status: 'Error',
			message: 'No token provided or invalid.',
		});
	}

	const userId = typeof decodedToken !== 'string' ? decodedToken.id : null;

	req.body.userId = userId;

	next();
}
