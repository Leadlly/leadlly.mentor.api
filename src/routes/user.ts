import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import convertToLowercase from "../middlewares/lowercase";
import { mentorlInfo } from "../controllers/Auth";


const router = express.Router();

router.post("/info/save", checkAuth, convertToLowercase, mentorlInfo);

export default router;
