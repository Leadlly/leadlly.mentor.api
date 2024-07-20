import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getStudentPlanner } from "../controllers/Student/planner";
import { getStudentTracker } from "../controllers/Student/tracker";
import { getMonthlyReport, getOverallReport, getWeeklyReport } from "../controllers/Student/reports";

const router = express.Router();

router.get("/planner/get/:id", checkAuth, getStudentPlanner);
router.get("/tracker/get/:id", checkAuth, getStudentTracker);
router.get("/report/week", checkAuth, getWeeklyReport);
router.get("/report/month", checkAuth, getMonthlyReport);
router.get("/report/overall", checkAuth, getOverallReport);

export default router;
