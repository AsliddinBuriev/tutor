import { sign, verify } from 'jsonwebtoken';

export const jwtSign = (id: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		sign(
			{ id: id },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRATION },
			(err, token) => {
				if (err) return reject(err);
				else return resolve(token);
			}
		);
	});
};

export const jwtVerify = (token: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) return reject(err);
			else return resolve(decoded);
		});
	});
};
