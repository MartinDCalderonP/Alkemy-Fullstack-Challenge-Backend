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

module.exports = router;
