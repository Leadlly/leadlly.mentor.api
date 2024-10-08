import { NextFunction, Request, Response } from 'express';
import { db } from '../../db/db';
import { CustomError } from '../../middlewares/error';
import mongoose from 'mongoose';

export const getWeeklyQuiz = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = req.params.id;

		const Quiz = db.collection('quizzes');

		let query: any = {
			user: new mongoose.Types.ObjectId(userId),
			quizType: 'weekly',
		};

		if (req.query.attempted === 'attempted') {
			query.attempted = true;
		} else {
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
	} catch (error: any) {
		next(new CustomError(error.message));
	}
};

export const getChapterQuiz = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = req.params.id;

		const Quiz = db.collection('quizzes');

		let query: any = {
			user: new mongoose.Types.ObjectId(userId),
			quizType: 'chapter',
		};

		if (req.query.attempted === 'attempted') {
			query.attempted = true;
		} else {
			query.attempted = false;
		}

		const chapterquiz = await Quiz.find(query).sort({ createdAt: -1 }).toArray();

		if (!chapterquiz) {
			return res.status(404).json({
				success: false,
				message: 'Quizzes does not exist for the current week',
			});
		}

		res.status(200).json({
			success: true,
			chapterquiz,
		});
	} catch (error: any) {
		next(new CustomError(error.message));
	}
};
