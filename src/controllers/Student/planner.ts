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
    const Planner = db.collection("planners")
    const userId = req.params.id;


    // Extract startDate and endDate from the request body
    const { startDate: requestStartDate, endDate: requestEndDate } = req.body;

    let startDate, endDate;

    if (requestStartDate && requestEndDate) {
      // Convert provided startDate and endDate to IST
      startDate = moment(requestStartDate).tz("Asia/Kolkata").startOf("day").toDate();
      endDate = moment(requestEndDate).tz("Asia/Kolkata").endOf("day").toDate();
    } else {
      // Default to current week
      startDate = moment().tz("Asia/Kolkata").startOf("isoWeek").toDate();
      endDate = moment(startDate).tz("Asia/Kolkata").endOf("isoWeek").toDate();
    }

    const planner = await Planner.findOne({
      student: new mongoose.Types.ObjectId(userId),
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
    });

    if (!planner) {
      return res.status(404).json({
        success: false,
        message: "Planner not exists for the specified period",
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
