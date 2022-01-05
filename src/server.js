const express = require('express');
const dotenv = require('dotenv');
const movesRoutes = require('./routes/moves_routes');

dotenv.config();

const app = express();

app.use('/moves', movesRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}...`);
});
