export class CustomError extends Error {
	status: 'fail' | 'error';
	isOperational: boolean;
	constructor(public message: string, public statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}
