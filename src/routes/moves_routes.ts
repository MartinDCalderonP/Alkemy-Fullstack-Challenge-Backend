import express from 'express';
import connection from '../connection';
import userAuth from '../middlewares/userAuth';

const router = express.Router();

router.get('/', userAuth, (req, res) => {
	const sqlGetMovesByUserId = `
		SELECT *
		FROM Moves
		LEFT JOIN moves_users
		ON moves.move_id=moves_users.mous_move_id
		RIGHT JOIN users
		ON moves_users.mous_user_id=users.user_id
		WHERE users.user_id = ?;
    `;

	const valuesGetMovesByUserId = [req.body.userId];

	connection.query(
		sqlGetMovesByUserId,
		valuesGetMovesByUserId,
		(err, result) => {
			if (err) {
				return res.json({
					status: 'Error',
					message: err,
				});
			}

			res.json(result);
		}
	);
});

router.get('/move-id/:moveId', userAuth, (req, res) => {
	const sqlGetMoveById = `
		SELECT *
		FROM Moves
		LEFT JOIN moves_users
		ON moves.move_id=moves_users.mous_move_id
		RIGHT JOIN users
		ON moves_users.mous_user_id=users.user_id
		WHERE users.user_id = ?
		AND moves.move_id = ?;
	`;

	const valuesGetMoveById = [req.body.userId, req.params.moveId];

	connection.query(sqlGetMoveById, valuesGetMoveById, (err, result) => {
		if (err) {
			return res.json({
				status: 'Error',
				message: err,
			});
		}

		res.json(result);
	});
});

router.post('/', userAuth, (req, res) => {
	const sqlPostMove = `
		INSERT INTO Moves (
			move_description,
			move_amount,
			move_type,
			move_date
		) VALUES (
			?,
			?,
			?,
			?
		)
	`;

	const valuesPostMove = [
		req.body.description,
		req.body.amount,
		req.body.type,
		req.body.date,
	];

	connection.query(sqlPostMove, valuesPostMove, (err, result) => {
		if (err) {
			return res.json({
				status: 'Error',
				message: 'Error when trying to create a new move. Please try again.',
			});
		}

		const sqlPostMoveUser = `
			INSERT INTO moves_users (
				mous_move_id,
				mous_user_id
			) VALUES (
				?,
				?
			)
		`;

		const valuesPostMoveUser = [result.insertId, req.body.userId];

		connection.query(sqlPostMoveUser, valuesPostMoveUser, (err) => {
			if (err) {
				return res.json({
					status: 'Error',
					message: 'Error when trying to create a new move. Please try again.',
				});
			}

			res.json({
				status: 'Success',
				message: 'Move created successfully.',
			});
		});
	});
});

router.put('/:moveId', userAuth, (req, res) => {
	const sqlUpdateMove = `
		UPDATE Moves
		SET move_description = ?,
			move_amount = ?,
			move_date = ?
		WHERE move_id = ?
	`;

	const valuesUpdateMove = [
		req.body.description,
		req.body.amount,
		req.body.date,
		req.params.moveId,
	];

	connection.query(sqlUpdateMove, valuesUpdateMove, (err) => {
		if (err) {
			return res.json({
				status: 'Error',
				message: 'Error when trying to update a move. Please try again.',
			});
		}

		res.json({
			status: 'Success',
			message: 'Move updated successfully.',
		});
	});
});

router.delete('/:moveId', userAuth, (req, res) => {
	const sqlDeleteMoveUser = `
		DELETE FROM moves_users
		WHERE mous_move_id = ?
		AND mous_user_id = ?
	`;

	const valuesDeleteMoveUser = [req.params.moveId, req.body.userId];

	connection.query(sqlDeleteMoveUser, valuesDeleteMoveUser, (err) => {
		if (err) {
			return res.json({
				status: 'Error',
				message: 'Error when trying to delete a move. Please try again.',
			});
		}

		const sqlDeleteMove = `
			DELETE FROM Moves
			WHERE move_id = ?
		`;

		const valuesDeleteMove = [req.params.moveId];

		connection.query(sqlDeleteMove, valuesDeleteMove, (err) => {
			if (err) {
				return res.json({
					status: 'Error',
					message: 'Error when trying to delete a move. Please try again.',
				});
			}

			res.json({
				status: 'Success',
				message: 'Move deleted successfully.',
			});
		});
	});
});

export default router;
