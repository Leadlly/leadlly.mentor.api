import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { acceptMeeting, getMeetings, rescheduleMeeting } from "../controllers/Meeting";

const router = express.Router();

router.put("/accept/:meetingId", checkAuth, acceptMeeting);

// Route to reschedule a meeting
router.put("/reschedule/:meetingId", checkAuth, rescheduleMeeting);
router.get("/get", checkAuth, getMeetings);

export default router