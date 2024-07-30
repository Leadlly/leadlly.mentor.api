"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeetings = exports.scheduleMeeting = exports.rescheduleMeeting = exports.acceptMeeting = void 0;
const error_1 = require("../../middlewares/error");
const db_1 = require("../../db/db");
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const acceptMeeting = async (req, res, next) => {
    try {
        const Meeting = db_1.db.collection("meetings");
        const { meetingId } = req.params;
        const meeting = await Meeting.findOne({ _id: new mongoose_1.default.Types.ObjectId(meetingId) });
        if (!meeting) {
            throw new error_1.CustomError("Meeting not found", 404);
        }
        await Meeting.updateOne({ _id: new mongoose_1.default.Types.ObjectId(meetingId) }, { $set: {
                accepted: true,
                updatedAt: new Date()
            } });
        res.status(200).json({
            success: true,
            message: "Meeting accepted successfully",
        });
    }
    catch (error) {
        next(new error_1.CustomError(error.message, error.status || 500));
    }
};
exports.acceptMeeting = acceptMeeting;
const rescheduleMeeting = async (req, res, next) => {
    try {
        const Meeting = db_1.db.collection("meetings");
        const { meetingId } = req.params;
        const { date, time } = req.body;
        const meeting = await Meeting.findOne({ _id: new mongoose_1.default.Types.ObjectId(meetingId) });
        if (!meeting) {
            throw new error_1.CustomError("Meeting not found", 404);
        }
        await Meeting.updateOne({ _id: new mongoose_1.default.Types.ObjectId(meetingId) }, { $set: {
                "rescheduled.isRescheduled": true,
                "rescheduled.date": new Date(date),
                "rescheduled.time": time,
                updatedAt: new Date()
            } });
        res.status(200).json({
            success: true,
            message: "Meeting rescheduled successfully",
        });
    }
    catch (error) {
        next(new error_1.CustomError(error.message, error.status || 500));
    }
};
exports.rescheduleMeeting = rescheduleMeeting;
const scheduleMeeting = async (req, res, next) => {
    try {
        const Meeting = db_1.db.collection("meetings");
        const { date, time, studentIds } = req.body;
        if (!date || !time || !Array.isArray(studentIds) || studentIds.length === 0) {
            throw new error_1.CustomError("Invalid input data", 400);
        }
        const meetingDate = new Date(date);
        if (isNaN(meetingDate.getTime())) {
            throw new error_1.CustomError("Invalid date format", 400);
        }
        const mentorId = req.user._id;
        const gmeetLink = req.user.gmeet;
        const meetingInsertions = studentIds.map(studentId => ({
            date: meetingDate,
            time: time,
            student: new mongoose_1.default.Types.ObjectId(studentId),
            mentor: new mongoose_1.default.Types.ObjectId(mentorId),
            gmeet: gmeetLink,
            createdBy: 'mentor',
            isCompleted: false,
            accepted: true
        }));
        await Meeting.insertMany(meetingInsertions);
        res.status(200).json({
            success: true,
            message: `Meeting scheduled successfully for ${studentIds.join(", ")}`,
        });
    }
    catch (error) {
        next(new error_1.CustomError(error.message, error.status || 500));
    }
};
exports.scheduleMeeting = scheduleMeeting;
const getMeetings = async (req, res, next) => {
    try {
        const Meeting = db_1.db.collection("meetings");
        const mentorId = req.user._id;
        const { studentId } = req.query;
        // Convert mentorId to ObjectId
        const mentorObjectId = new mongoose_1.default.Types.ObjectId(mentorId);
        // Initialize a query object
        let query = {
            mentor: mentorObjectId
        };
        if (studentId) {
            const studentObjectId = new mongoose_1.default.Types.ObjectId(studentId);
            query.student = studentObjectId;
        }
        else {
            // Find mentor by mentorId and get all students
            const mentor = await userModel_1.default.findById(mentorObjectId);
            if (!mentor) {
                throw new error_1.CustomError("Mentor not found", 404);
            }
            const studentIds = mentor.students.map((student) => student.id);
            query.student = { $in: studentIds };
        }
        const meetings = await Meeting.find(query).toArray();
        res.status(200).json({
            message: "Meetings fetched successfully",
            meetings
        });
    }
    catch (error) {
        next(new error_1.CustomError(error.message, error.status || 500));
    }
};
exports.getMeetings = getMeetings;
