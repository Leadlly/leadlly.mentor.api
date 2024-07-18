import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../middlewares/error";
import { db } from "../../db/db";
import mongoose from "mongoose";
import Mentor from "../../models/userModel";

export const acceptMeeting = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const Meeting = db.collection("meetings")
        const { meetingId } = req.params;

        const meeting = await Meeting.findOne({ _id: new mongoose.Schema.Types.ObjectId(meetingId)});
        if (!meeting) {
            throw new CustomError("Meeting not found", 404);
        }

        meeting.accepted = true;
        meeting.updatedAt = new Date();

        await meeting.save();

        res.status(200).json({
            success: true,
            message: "Meeting accepted successfully",
            meeting
        });

    } catch (error: any) {
        next(new CustomError(error.message, error.status || 500));
    }
};


export const rescheduleMeeting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Meeting = db.collection("meetings");
        const { meetingId } = req.params;
        const { date, time } = req.body;

        const meeting = await Meeting.findOne({ _id: new mongoose.Schema.Types.ObjectId(meetingId) });
        if (!meeting) {
            throw new CustomError("Meeting not found", 404);
        }

        await Meeting.updateOne(
            { _id: new mongoose.Schema.Types.ObjectId(meetingId) },
            { $set: { 
                "rescheduled.isRescheduled": true,
                "rescheduled.date": new Date(date),
                "rescheduled.time": time,
                updatedAt: new Date()
            }}
        );

        res.status(200).json({
            success: true,
            message: "Meeting rescheduled successfully",
        });

    } catch (error: any) {
        next(new CustomError(error.message, error.status || 500));
    }
};


export const scheduleMeeting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Meeting = db.collection("meetings");
        const { date, time, studentIds } = req.body;

        if (!date || !time || !Array.isArray(studentIds) || studentIds.length === 0) {
            throw new CustomError("Invalid input data", 400);
        }

        const meetingDate = new Date(date);
        if (isNaN(meetingDate.getTime())) {
            throw new CustomError("Invalid date format", 400);
        }

        const mentorId = req.user._id;
        const gmeetLink = req.user.gmeet;

        const meetingInsertions = studentIds.map(studentId => ({
            date: meetingDate,
            time: time,
            student: studentId,
            mentor: mentorId,
            gmeet: gmeetLink
        }));

        await Meeting.insertMany(meetingInsertions);

        res.status(200).json({
            success: true,
            message: `Meeting scheduled successfully for ${studentIds.join(", ")}`,
        });

    } catch (error: any) {
        next(new CustomError(error.message, error.status || 500));
    }
};

export const getMeetings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Meeting = db.collection("meetings");
        const mentorId = req.user._id;
        const { studentId } = req.query;

        // Convert mentorId to ObjectId
        const mentorObjectId = new mongoose.Types.ObjectId(mentorId);

        // Initialize a query object
        let query: any = {
            mentor: mentorObjectId
        };

        if (studentId) {
            const studentObjectId = new mongoose.Types.ObjectId(studentId as string);
            query.student = studentObjectId;
        } else {
            // Find mentor by mentorId and get all students
            const mentor = await Mentor.findById(mentorObjectId)
            if (!mentor) {
                throw new CustomError("Mentor not found", 404);
            }

            const studentIds = mentor.students.map((student: any) => student.id);
            query.student = { $in: studentIds };
        }

        const meetings = await Meeting.find(query).toArray();

        res.status(200).json({
            message: "Meetings fetched successfully",
            meetings
        });

    } catch (error: any) {
        next(new CustomError(error.message, error.status || 500));
    }
};