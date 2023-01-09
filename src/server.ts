import http from 'http';
import { config } from 'dotenv';
import { App } from './app';
import dataSource from './dataSource';
import path from 'path';
config({ path: path.join(__dirname, '../config.env') });

const { app } = new App();

dataSource
	.initialize()
	.then(async () => {
		app.listen({ port: process.env.PORT || 5000 }, async () => {
			console.log(
				`Server running on port ${process.env.PORT}\nEnvironment ${process.env.NODE_ENV}`
			);
		});
	})
	.catch((err) => {
		console.error('Error connecting to database', err);
	});
