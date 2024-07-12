import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { mentorlInfo } from "../controllers/User";

const router = express.Router();
router.post("/info/save", checkAuth, mentorlInfo);

export default router;
