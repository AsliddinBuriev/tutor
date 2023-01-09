import { catchAsyncError } from './utils/catch-async-error';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/custom-error';
import { ClassesRepository } from '../repository/class.repository';
import { UsersRepository } from '../repository/users.repository';

export const subscribe = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const classId = req.params.id;
    const classRepo = new ClassesRepository();
    const userRepo = new UsersRepository();
    const classObj = await classRepo.findOne({ where: { id: classId } });
    if (!classObj) return next(new CustomError('There is no class with this id', 404));
    await userRepo.update(req.user.id, { subscribedClasses: [...req.user.subscribedClasses, classObj] });
    await classRepo.update(classId, { students:  req.user });
    res.status(200).json({
        status: 'success',
        message: 'Subscribed to class',
    })
})

export const unSubscribe = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const classId = req.params.id;
    const classRepo = new ClassesRepository();
    const userRepo = new UsersRepository();
    const classObj = await classRepo.findOne({ where: { id: classId } });
    if (!classObj) return next(new CustomError('There is no class with this id', 404));
    await userRepo.update(req.user.id, { subscribedClasses: req.user.subscribedClasses.filter((classObj) => classObj.id !== classId) });
    await classRepo.update(classId, { students: classObj.students.filter((user) => user.id !== req.user.id) });
    res.status(200).json({
        status: 'success',
        message: 'Unsubscribed from class',
        data: {}
    })
})