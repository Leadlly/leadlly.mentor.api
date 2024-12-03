"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const db_1 = require("../../db/db");
const error_1 = require("../../middlewares/error");
const mongoose_1 = __importDefault(require("mongoose"));
const sendNotification = async (req, res, next) => {
    try {
        const Notification = db_1.db.collection('notifications');
        const { studentIds, message, urls, option } = req.body;
        console.log(studentIds, message, urls, option);
        if (!Array.isArray(studentIds) || studentIds.length === 0 || !message || !Array.isArray(urls) || !option) {
            throw new error_1.CustomError('Invalid input data', 400);
        }
        const senderId = req.user._id;
        const notificationInsertions = studentIds.map((studentId) => ({
            sender: new mongoose_1.default.Types.ObjectId(senderId),
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
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
    }
    catch (error) {
        next(new error_1.CustomError(error.message, error.status || 500));
    }
};
exports.sendNotification = sendNotification;
