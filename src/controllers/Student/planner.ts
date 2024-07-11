import { Request, Response, NextFunction } from "express";
import moment from "moment-timezone";
import { db } from "../../db/db";
import { CustomError } from "../../middlewares/error";
export const getStudentPlanner = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {

      const Planner = db.collection("planners")
      const userId = req.params.id;
  
      const startDate = moment().startOf("isoWeek").toDate();
      const endDate = moment(startDate).endOf("isoWeek").toDate();
      
      const planner = await Planner.findOne({
        student: userId,
        startDate: { $gte: startDate },
        endDate: { $lte: endDate },
      });
  
      if (!planner) {
        return res.status(404).json({
          success: false,
          message: "Planner not exists for the current week",
        });
      }
  
      res.status(200).json({
        success: true,
        data: planner,
      });
    } catch (error: any) {
      console.error(error);
      next(new CustomError(error.message));
    }
  };
  