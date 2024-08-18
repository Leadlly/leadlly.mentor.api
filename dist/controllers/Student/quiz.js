"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklyQuiz = void 0;
const db_1 = require("../../db/db");
const error_1 = require("../../middlewares/error");
const mongoose_1 = __importDefault(require("mongoose"));
const getWeeklyQuiz = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const Quiz = db_1.db.collection('quizzes');
        let query = {
            user: new mongoose_1.default.Types.ObjectId(userId),
            quizType: 'weekly',
        };
        if (req.query.attempted === 'attempted') {
            query.attempted = true;
        }
        else {
            query.attempted = false;
        }
        const weeklyQuiz = await Quiz.find(query).sort({ createdAt: -1 }).toArray();
        if (!weeklyQuiz) {
            return res.status(404).json({
                success: false,
                message: 'Quizzes does not exist for the current week',
            });
        }
        res.status(200).json({
            success: true,
            weeklyQuiz,
        });
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.getWeeklyQuiz = getWeeklyQuiz;
