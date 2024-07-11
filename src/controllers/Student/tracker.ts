import { Request, Response, NextFunction } from "express";
import moment from "moment-timezone";
import { db } from "../../db/db";
import { CustomError } from "../../middlewares/error";

export const getStudentTracker = async (req: Request, res: Response, next: NextFunction) => {
    try {

    const Tracker = db.collection("trackers")
   
      const tracker = await Tracker.find({ user: req.params.id, "subject.name": req.query.subject });
  
      if (!tracker) {
        return res.status(404).json({
          success: false,
          message: "No tracker data found for this user",
        });
      }
  
      return res.status(200).json({
        success: true,
        tracker,
      });
    } catch (error: any) {
      next(new CustomError(error.message));
    }
  };