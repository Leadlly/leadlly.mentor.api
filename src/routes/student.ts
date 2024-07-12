import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getStudentPlanner } from "../controllers/Student/planner";
import { getStudentTracker } from "../controllers/Student/tracker";

const router = express.Router();

router.get("/planner/get", checkAuth, getStudentPlanner);
router.get("/tracker/get", checkAuth, getStudentTracker);

export default router;
