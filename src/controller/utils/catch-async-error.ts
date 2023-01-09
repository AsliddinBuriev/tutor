import express, { Request, Response } from 'express';
export const catchAsyncError = (fn: Function) => {
	return (req: Request, res: Response, next: express.NextFunction) => {
		fn(req, res, next).catch(next);
	};
};
