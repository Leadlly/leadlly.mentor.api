import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { acceptMeeting, getMeetings, rescheduleMeeting } from "../controllers/Meeting";

const router = express.Router();

router.put("/meeting/accept/:meetingId", checkAuth, acceptMeeting);

// Route to reschedule a meeting
router.put("/meeting/reschedule/:meetingId", checkAuth, rescheduleMeeting);
router.get("/meeting/get", checkAuth, getMeetings);

export default router