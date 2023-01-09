import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import errorHandler from './controller/error.controller';
import { CustomError } from './utils/custom-error';
import userRouter from './routes/user.route';
import classRouter from './routes/class.route';

export class App {
	app: Express;
	constructor() {
		this.app = express();
		this.middlewares();
		this.routes();
		this.errorHandler();
		this.settings();
	}
	settings() {}
	middlewares() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}
	routes() {
		this.app.use('/api/user', userRouter)
		this.app.use('/api/class', classRouter)
		this.app.use('*', (req, res, next) => {
			console.log(req.originalUrl);
			next(new CustomError('there is no such route', 404));
		});
	}
	errorHandler() {
		this.app.use(errorHandler);
	}
}
