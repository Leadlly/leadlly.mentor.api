import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../middlewares/error";
import { db } from "../../db/db";
import mongoose from 'mongoose';

export const getStudentInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return next(new CustomError("Invalid student ID", 400));
    }

    const Student = db.collection("users");

    const student = await Student.findOne({ _id: new mongoose.Types.ObjectId(studentId) });

    if (!student) {
      return next(new CustomError("Student not found", 404));
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error: any) {
    next(new CustomError(error.message));
  }
};