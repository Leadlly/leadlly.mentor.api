import { NextFunction, Request, Response } from 'express';
import { db } from '../../db/db';
import { CustomError } from '../../middlewares/error';

export const getErrorBook = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const SolvedQuestions = db.collection('SolvedQuestions');
		const userId = req.params.id;
		const errorBook = await SolvedQuestions.aggregate([
			{
				$match: {
					student: req.user._id,
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

		if (!errorBook || errorBook.length < 1) {
			return res.status(200).json({
				success: true,
				message: 'No ErrorBook data found for this user',
			});
		}

		return res.status(200).json({
			success: true,
			errorBook,
		});
	} catch (error: any) {
		console.error(error);
		next(new CustomError(error.message));
	}
};
export const getChapterErrorBook = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const SolvedQuestions = db.collection('SolvedQuestions');
		const userId = req.params.id;
		const chapterName = req.params.chapter;
		const chapterErrorBook = await SolvedQuestions.aggregate([
			{
				$match: {
					student: req.user._id,
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
		console.log(chapterErrorBook);
	} catch (error: any) {
		console.error(error);
		next(new CustomError(error.message));
	}
};