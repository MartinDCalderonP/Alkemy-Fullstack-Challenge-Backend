const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.post('/users', (req, res) => {
	let sqlInsertUser = `
        INSERT INTO Users (
            user_email,
            user_password
        ) VALUES (
            ?,
            ?
        )
    `;

	let valuesInsertUser = [req.body.email, req.body.password];

	connection.query(sqlInsertUser, valuesInsertUser, (err, result, fields) => {
		if (err) {
			res.json({
				status: 'Error',
				message: 'Error when trying to sign up a new user. Please try again.',
			});
		} else {
			res.json({
				status: 'Success',
				message: 'User signed up successfully.',
			});
		}
	});
});

module.exports = router;
