import express from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { acceptMeeting, getMeetings, rescheduleMeeting, scheduleMeeting } from "../controllers/Meeting";

const router = express.Router();

router.put("/accept/:meetingId", checkAuth, acceptMeeting);
router.put("/reschedule/:meetingId", checkAuth, rescheduleMeeting);
router.put("/schedule/", checkAuth, scheduleMeeting);
router.get("/get", checkAuth, getMeetings);

export default router