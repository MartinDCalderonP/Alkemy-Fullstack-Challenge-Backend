const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.get('/', (req, res) => {
	let sqlMoves = `
        SELECT *
        FROM Moves
    `;

	connection.query(sqlMoves, (err, result, fields) => {
		if (err) throw err;

		res.json(result);
	});
});

router.get('/:id', (req, res) => {
	let sqlMoveById = `
		SELECT *
		FROM Moves
		WHERE move_id = ?
	`;

	let valuesMoveById = [req.params.id];

	connection.query(sqlMoveById, valuesMoveById, (err, result, fields) => {
		if (err) throw err;

		res.json(result);
	});
});

router.post('/', (req, res) => {
	let sqlPostMove = `
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

	let valuesPostMove = [
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
	let sqlUpdateMove = `
		UPDATE Moves
		SET move_description = ?,
			move_amount = ?,
			move_date = ?
		WHERE move_id = ?
	`;

	let valuesUpdateMove = [
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
	let sqlDeleteMove = `
        DELETE FROM Moves
        WHERE move_id = ?
    `;

	let valuesDeleteMove = [req.params.id];

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
