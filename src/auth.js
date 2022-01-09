const auth = function (req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.status(401);
		res.send({
			status: 'Error',
			message: 'Unauthorized access',
		});
	}
};

module.exports = auth;
