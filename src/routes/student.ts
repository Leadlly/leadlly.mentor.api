import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { getStudentPlanner } from '../controllers/Student/planner';
import { getStudentTracker } from '../controllers/Student/tracker';
import {
	getMonthlyReport,
	getOverallReport,
	getWeeklyReport,
} from '../controllers/Student/reports';
import { getChapterErrorBook, getErrorBook } from '../controllers/Student/errorBook';
import { getChapterQuiz, getWeeklyQuiz } from '../controllers/Student/quiz';

const router = express.Router();

router.get('/planner/get/:id', checkAuth, getStudentPlanner);
router.get('/tracker/get/:id', checkAuth, getStudentTracker);
router.get('/report/week', checkAuth, getWeeklyReport);
router.get('/report/month', checkAuth, getMonthlyReport);
router.get('/report/overall', checkAuth, getOverallReport);

router.get('/errorBook/get/:id', checkAuth, getErrorBook);
router.get('/errorBook/chapter/get/:id', checkAuth, getChapterErrorBook);
router.get('/quiz/weeklyQuiz/get/:id', checkAuth, getWeeklyQuiz);
router.get('/quiz/chapter/get/:id', checkAuth, getChapterQuiz);
export default router;
