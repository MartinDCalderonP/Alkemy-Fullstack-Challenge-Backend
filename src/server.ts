import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import FileStore from 'session-file-store';
import signInRoutes from './routes/signIn_routes';
import signUpRoutes from './routes/signUp_routes';
import movesRoutes from './routes/moves_routes';

const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:3000',
		allowedHeaders: [
			'Access-Control-Allow-Origin',
			'Content-Type',
			'Authorization',
		],
	})
);

const sessionFileStore = FileStore(session);

app.use(
	session({
		store: new sessionFileStore(),
		secret: '123456789',
		resave: false,
		saveUninitialized: true,
		name: 'Alkemy Fullstack Challenge',
	})
);

app.use('/sign-in', signInRoutes);
app.use('/sign-up', signUpRoutes);
app.use('/moves', movesRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}...`);
});
