import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { promisify } from 'util';
import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from '../repository/users.repository';
import { CustomError } from '../utils/custom-error';
import { jwtSign, jwtVerify } from './utils/jwt';
import { catchAsyncError } from './utils/catch-async-error';

export const signup = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
	const usersRepo = new UsersRepository();
	const { name, email, password, role } = req.body;
	if (!name || !email || !password || !role)
		return next(new CustomError('Please provide name, email, password and role', 400));
	const user = await usersRepo.findOne({ where: { email } });
	if (user)
		return next(
			new CustomError('User with this email already exists', 400)
		);
	const hashedPassword = await bcryptjs.hash(password, 12);
	const newUser = await usersRepo.create({
		name,
		email,
		password: hashedPassword,
		role,
	});
	const token = await jwtSign(newUser.id);
	newUser.password = undefined;
	res.status(201).json({
		status: 'success',
		message: 'User created',
		token,
		data: { user: newUser }
	});
})

export const login = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		const usersRepo = new UsersRepository();
		const { email, password } = req.body;
		if (!email || !password)
			return next(
				new CustomError('Please provide email and password', 400)
			);
		const user = await usersRepo.findOne({
			select: ['id', 'name', 'password', 'email', 'role'],
			where: { email },
		});
		if (!user || !(await bcryptjs.compare(password, user.password)))
			return next(
				new CustomError('You provided wrong email or password!', 400)
			);
		const token = await jwtSign(user.id);
		user.password = undefined;
		res.status(200).json({
			status: 'success',
			message: 'Logged in',
			token,
			data: { user },
		});
	}
);

export const guard = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		const usersRepo = new UsersRepository();
		const { authorization } = req.headers;
		let token: string;
		if (authorization && authorization.startsWith('Bearer'))
			token = authorization.split(' ')[1];
		if (!token) {
			return next(
				new CustomError(
					'You are not logged in! Please log in first.',
					401
				)
			);
		}
		const decoded = await jwtVerify(token);
		const user = await usersRepo.findOne({ where: { id: decoded.id } });
		if (!user)
			return next(
				new CustomError(
					`You don't have an account please create an account.`,
					401
				)
			);
		user.password = null;
		req.user = user;
		next();
	}
);

export const authorize = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new CustomError(
					`You don't have permission to access this route.`,
					403
				)
			);
		}
		return next();
	};
};

