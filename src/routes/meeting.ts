import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { acceptMeeting, rescheduleMeeting } from "../controllers/Meeting";

const router = express.Router();

router.put("/meeting/accept/:meetingId", acceptMeeting);

// Route to reschedule a meeting
router.put("/meeting/reschedule/:meetingId", rescheduleMeeting);

export default router