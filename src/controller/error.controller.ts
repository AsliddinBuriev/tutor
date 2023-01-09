import express, { Request, Response } from 'express';
import { CustomError } from '../utils/custom-error';

export default (
	err: CustomError,
	req: Request,
	res: Response,
	next: express.NextFunction
) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	let error = Object.create(err);
	// console.log(error);
	if (
		error.message ===
		'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email'
	) {
		error = new CustomError(
			'User with this email address has already been registered. Please use different email',
			400
		);
	} else if (
		error.message === 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed'
	) {
		error = new CustomError(
			'You cannot delete',
			400
		);
	}
	if (
		error.name === 'TokenExpiredError' ||
		error.name === 'JsonWebTokenError'
	)
		error = new CustomError('You are not logged in, please log in.', 401);

	if (process.env.NODE_ENV === 'development') devError(res, error);
	if (process.env.NODE_ENV === 'production') prodError(res, error);
};

const devError = (res: Response, err: CustomError) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		err,
	});
};
const prodError = (res: Response, err: CustomError) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
	}
};
