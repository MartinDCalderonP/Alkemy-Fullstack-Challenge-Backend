const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.get('/', (req, res) => {
	let sqlMoves = `
        SELECT *
        FROM Moves
    `;

	connection.query(sqlMoves, (err, result) => {
		if (err) throw err;

		res.json(result);
	});
});

router.post('/', (req, res) => {
	let sqlPostMove = `
        INSERT INTO Moves (move_description, move_amount, move_type, move_date)
        VALUES (?, ?, ?, ?)
    `;

	let valuesPostMove = [
		req.body.description,
		req.body.amount,
		req.body.type,
		req.body.date,
	];

	connection.query(sqlPostMove, valuesPostMove, (err, result) => {
		if (err) {
			res.json({
				status: 'Error.',
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

module.exports = router;
