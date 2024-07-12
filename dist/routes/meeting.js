"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Meeting_1 = require("../controllers/Meeting");
const router = express_1.default.Router();
router.put("/meeting/accept/:meetingId", Meeting_1.acceptMeeting);
// Route to reschedule a meeting
router.put("/meeting/reschedule/:meetingId", Meeting_1.rescheduleMeeting);
exports.default = router;
