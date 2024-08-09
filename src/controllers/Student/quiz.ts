import { NextFunction, Request, Response } from 'express';
import { db } from '../../db/db';
import { CustomError } from '../../middlewares/error';
export const getWeeklyQuiz = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = req.params.id;

		const Quiz = db.collection('quizzes');

		let query: any = {
			user: userId,
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
