import { NextFunction, Request, Response } from 'express';
import { db } from '../../db/db';
import { CustomError } from '../../middlewares/error';
import mongoose from 'mongoose';

export const sendNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Notification = db.collection('notifications');
        const { studentIds, message, urls, option } = req.body;
        console.log(studentIds,message,urls,option)

        if (!Array.isArray(studentIds) || studentIds.length === 0 || !message || !Array.isArray(urls) || !option) {
            throw new CustomError('Invalid input data', 400);
        }

        const senderId = req.user._id;

        const notificationInsertions = studentIds.map((studentId) => ({
            sender: new mongoose.Types.ObjectId(senderId),
            studentId: new mongoose.Types.ObjectId(studentId),
            message: message,
            urls: urls,
            isRead: false,
            option: option,
            createdAt: new Date()
        }));

        await Notification.insertMany(notificationInsertions);

        res.status(200).json({
            success: true,
            message: `Notifications sent successfully to ${studentIds.join(', ')}`
        });
    } catch (error: any) {
        next(new CustomError(error.message, error.status || 500));
    }
};
