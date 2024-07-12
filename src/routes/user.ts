import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { mentorlInfo } from "../controllers/User";
import convertToLowercase from "../middlewares/lowercase";

const router = express.Router();
router.post("/info/save", checkAuth, convertToLowercase, mentorlInfo);

export default router;
