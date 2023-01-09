import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/custom-error';
import { catchAsyncError } from './utils/catch-async-error';
import { ClassesRepository } from '../repository/class.repository';

export const createClass = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, isPaid } = req.body;
    // if (!title || !description || isPaid !== true || isPaid !== false) return next(new CustomError('Please provide title, description and isPaid', 400));
    const classObj = {
        title,
        description,
        isPaid,
        tutor: req.user
    }
    const classesRepo = new ClassesRepository();
    const newClass = await classesRepo.create(classObj);
    res.status(201).json({
        status: 'success',
        message: 'Class created',
        data: { class: newClass }
    })
})

export const getAllClasses = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const classesRepo = new ClassesRepository();
    const classes = await classesRepo.getAll();
    res.status(200).json({
        status: 'success',
        message: 'All classes',
        data: { classes }
    })
})

export const updateClass = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const classId = req.params.id
    const { title, description, isPaid } = req.body;
    const classRepo = new ClassesRepository();
    const lecture = await classRepo.findOne({ where: { id: classId }});
    if (!lecture) return next(new CustomError('There is no class with this id', 404));
    const updatedClass = await classRepo.update(classId, { title, description, isPaid });
    res.status(200).json({
        status: 'success',
        message: 'Class updated',
        data: { }
    })
})

export const deleteClass = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const classId = req.params.id;
    const classRepo = new ClassesRepository();
    const deletedClass = await classRepo.delete(classId);
    res.status(200).json({
        status: 'success',
        message: 'Class deleted',
        data: { class: deletedClass }
    })
})

export const subscribe = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const classId = req.params.id;
    const classRepo = new ClassesRepository();
    const classs = await classRepo.findOne({ where: { id: classId }});
    if (!classs) return next(new CustomError('There is no class with this id', 404));
    // class.subscribers = [...class.subscribers, req.user.id];
    // await classRepo.update(classId, { subscribers: class.subscribers });
    res.status(200).json({
        status: 'success',
        message: 'Class subscribed',
        data: { }
    })
})