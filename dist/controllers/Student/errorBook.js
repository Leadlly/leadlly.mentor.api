"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChapterErrorBook = exports.getErrorBook = void 0;
const db_1 = require("../../db/db");
const error_1 = require("../../middlewares/error");
const mongoose_1 = __importDefault(require("mongoose"));
const getErrorBook = async (req, res, next) => {
    try {
        const SolvedQuestions = db_1.db.collection('solvedquestions');
        const userId = req.params.id;
        const errorBook = await SolvedQuestions.aggregate([
            {
                $match: {
                    student: new mongoose_1.default.Types.ObjectId(userId),
                    isCorrect: false,
                },
            },
            { $unwind: '$question.chapter' },
            {
                $group: {
                    _id: {
                        chapter: '$question.chapter',
                        subject: '$question.subject',
                    },
                    totalQuestions: { $count: {} },
                },
            },
            { $sort: { totalQuestions: -1 } },
            {
                $group: {
                    _id: {
                        subject: '$_id.subject',
                    },
                    chapters: {
                        $push: {
                            chapter: '$_id.chapter',
                            totalQuestions: '$totalQuestions',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    subject: '$_id.subject',
                    chapters: 1,
                },
            },
            { $sort: { subject: 1 } },
        ]).toArray();
        // if (!errorBook || errorBook.length < 1) {
        // 	return res.status(400).json({
        // 		success: false,
        // 		message: 'No ErrorBook data found for this user',
        // 	});
        // }
        return res.status(200).json({
            success: true,
            errorBook,
        });
    }
    catch (error) {
        console.error(error);
        next(new error_1.CustomError(error.message));
    }
};
exports.getErrorBook = getErrorBook;
const getChapterErrorBook = async (req, res, next) => {
    try {
        const SolvedQuestions = db_1.db.collection('solvedquestions');
        const userId = req.params.id;
        const chapterName = req.params.chapter;
        const chapterErrorBook = await SolvedQuestions.aggregate([
            {
                $match: {
                    student: new mongoose_1.default.Types.ObjectId(userId),
                    isCorrect: false,
                    'question.chapter': chapterName,
                },
            },
            {
                $project: {
                    question: 1,
                },
            },
        ]).toArray();
        if (!chapterErrorBook || chapterErrorBook.length < 1) {
            return res.status(404).json({
                success: false,
                message: 'No chapter ErrorBook data found for this user',
            });
        }
        return res.status(200).json({
            success: true,
            chapterErrorBook,
        });
    }
    catch (error) {
        console.error(error);
        next(new error_1.CustomError(error.message));
    }
};
exports.getChapterErrorBook = getChapterErrorBook;
