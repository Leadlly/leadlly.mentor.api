import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";
import Planner from "../models/plannerModel";
import { questions_db } from "../db/db";
import mongoose from "mongoose";


export const createPlanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let bodydata = req.body;
        // console.log(bodydata);
        for (let student_id of bodydata.students) {
            console.log(student_id);
            // Convert student_id to ObjectId
            const objectId = new mongoose.Types.ObjectId(student_id);
            const student = await mongoose.connection.collection("users").findOne({ _id:objectId });
            if (!student) return next(new CustomError("Student not exists", 404));
            
            const plannersCollection = mongoose.connection.collection("planners")

            const existingPlanner = await plannersCollection.findOne({
                students: { $in: [student_id] },
                date: bodydata.date,
                day: bodydata.day
            })
            if(existingPlanner) return next(new CustomError(`Planner for date ${bodydata.date} already exists`))

            const planner = await plannersCollection.insertOne({
                ...bodydata,
                createdBy: req.user._id,
                createdAt: Date.now()
            });
            res.json({ planner });
        }
    } catch (error: any) {
        next(new CustomError(error.message, 500));
    }
};

export const updatePlanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error: any) {
        next(new CustomError(error.message, 500));
    }
};