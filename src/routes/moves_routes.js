const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.get('/by-user-id/:userId', (req, res) => {
	const sqlGetMovesByUserId = `
		SELECT *
		FROM Moves
		LEFT JOIN moves_users
		ON moves.move_id=moves_users.mous_move_id
		RIGHT JOIN users
		ON moves_users.mous_user_id=users.user_id
		WHERE users.user_id = ?;
    `;

	const valuesGetMovesByUserId = [req.params.userId];

	connection.query(
		sqlGetMovesByUserId,
		valuesGetMovesByUserId,
		(err, result, fields) => {
			if (err) throw err;

			res.json(result);
		}
	);
});

router.get('/by-move-id/:userId/:moveId', (req, res) => {
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

	const valuesGetMoveById = [req.params.userId, req.params.moveId];

	connection.query(sqlGetMoveById, valuesGetMoveById, (err, result, fields) => {
		if (err) throw err;

		res.json(result);
	});
});

router.post('/', (req, res) => {
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

	connection.query(sqlPostMove, valuesPostMove, (err, result, fields) => {
		if (err) {
			res.json({
				status: 'Error',
				message: 'Error when trying to create a new move. Please try again.',
			});
		} else {
			res.json({
				status: 'Success',
				message: 'Move created successfully.',
			});
		}
	});
});

router.put('/:id', (req, res) => {
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
		req.params.id,
	];

	connection.query(sqlUpdateMove, valuesUpdateMove, (err, result, fields) => {
		if (err) {
			res.json({
				status: 'Error',
				message: 'Error when trying to update a move. Please try again.',
			});
		} else {
			res.json({
				status: 'Success',
				message: 'Move updated successfully.',
			});
		}
	});
});

router.delete('/:id', (req, res) => {
	const sqlDeleteMove = `
        DELETE FROM Moves
        WHERE move_id = ?
    `;

	const valuesDeleteMove = [req.params.id];

	connection.query(sqlDeleteMove, valuesDeleteMove, (err, result, fields) => {
		if (err) {
			res.json({
				status: 'Error',
				message: 'Error when trying to delete a move. Please try again.',
			});
		} else {
			res.json({
				status: 'Success',
				message: 'Move deleted successfully.',
			});
		}
	});
});

module.exports = router;
