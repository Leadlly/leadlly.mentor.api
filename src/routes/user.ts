import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import convertToLowercase from "../middlewares/lowercase";
import { getAllocatedStudents, mentorlInfo } from "../controllers/user";


const router = express.Router();

router.post("/info/save", checkAuth, convertToLowercase, mentorlInfo);
router.get("/getstudents", checkAuth, getAllocatedStudents);

export default router;
