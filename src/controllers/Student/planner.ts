import { Request, Response, NextFunction } from "express";
import moment from "moment-timezone";
import { db } from "../../db/db";
import { CustomError } from "../../middlewares/error";
import mongoose from "mongoose";
export const getStudentPlanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Planner = db.collection('planners');
    const userId = req.params.id;

    // Extract startDate and endDate from the request body
    const { startDate: requestStartDate, endDate: requestEndDate } = req.body;

    let startDate, endDate;

    if (requestStartDate && requestEndDate) {
      // Convert provided startDate and endDate to Asia/Kolkata timezone and then to UTC
      startDate = moment(requestStartDate).tz("Asia/Kolkata").startOf("day").utc().toDate();
      endDate = moment(requestEndDate).tz("Asia/Kolkata").endOf("day").utc().toDate();
    } else {
      // Default to current week in Asia/Kolkata timezone and convert to UTC
      startDate = moment().tz("Asia/Kolkata").startOf("isoWeek").utc().toDate();
      endDate = moment(startDate).endOf("isoWeek").utc().toDate();
    }

    // Query the database using UTC dates
    const planner = await Planner.findOne({
      student: new mongoose.Types.ObjectId(userId),
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
    });

    if (!planner) {
      return res.status(404).json({
        success: false,
        message: "Planner does not exist for the specified period",
      });
    }

    res.status(200).json({
      success: true,
      data: planner,
    });
  } catch (error) {
    next(new CustomError((error as Error).message));
  }
};
