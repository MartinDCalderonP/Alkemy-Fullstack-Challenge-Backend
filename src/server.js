const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const auth = require('./auth');
const movesRoutes = require('./routes/moves_routes');

const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:3000',
		allowedHeaders: ['Access-Control-Allow-Origin', 'Content-Type'],
	})
);

app.use(
	session({
		store: new FileStore({ logFn: function () {} }),
		secret: '123456789',
		resave: false,
		saveUninitialized: true,
		name: 'Alkemy Fullstack Challenge',
	})
);

app.use('/auth', sessionRoutes);
app.use('/moves', movesRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}...`);
});
