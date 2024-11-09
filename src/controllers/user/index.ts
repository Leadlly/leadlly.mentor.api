import { oauth2Client } from "../../services/Google/getOauth";
import { NextFunction, Request, Response } from "express";
import User from "../../models/userModel";
import { CustomError } from "../../middlewares/error";
import IUser from "../../types/IUser";
import { db } from "../../db/db";
import mongoose from "mongoose";

export const mentorOauth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
    });
    res.redirect(authUrl);
  } catch (error: any) {
    next(new CustomError(error.message));
  }
};

export const mentorOauthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const user = (await User.findById(req.user._id)) as IUser;
    if (!user) return next(new CustomError("User not exists", 400));

    user.gmeet.tokens = tokens;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Authorization successful",
    });
  } catch (error: any) {
    next(new CustomError(error.message));
  }
};

export const mentorlInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bodyData = req.body;
    const mentor = await User.findById(req.user._id);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const updateData: any = {};

    if (bodyData.firstName) updateData.firstname = bodyData.firstName;
    if (bodyData.lastName) updateData.lastname = bodyData.lastName;
    if (bodyData.dateOfBirth) updateData['about.dateOfBirth'] = bodyData.dateOfBirth;
    if (bodyData.phone) updateData['phone.personal'] = bodyData.phone;
    if (bodyData.gender) updateData['about.gender'] = bodyData.gender;
    if (bodyData.address) updateData['address.addressLine'] = bodyData.address;
    if (bodyData.pinCode) updateData['address.pincode'] = bodyData.pinCode;
    if (bodyData.country) updateData['address.country'] = bodyData.country;
    if (bodyData.schoolOrCollegeName) updateData['academic.schoolOrCollegeName'] = bodyData.schoolOrCollegeName;
    if (bodyData.schoolOrCollegeAddress) updateData['academic.schoolOrCollegeAddress'] = bodyData.schoolOrCollegeAddress;
    if (bodyData.degree) updateData['academic.degree'] = bodyData.degree;
    if (bodyData.gmeet) updateData['gmeet.link'] = bodyData.gmeet;
    if (bodyData.class) updateData['preference.standard'] = bodyData.class;
    if (bodyData.competitiveExams) updateData['preference.competitiveExam'] = bodyData.competitiveExams;

    await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true });

    res.status(200).json({
      message: "Mentor information updated successfully",
      updateData,
    });
  } catch (error: any) {
    console.error("Error updating mentor info:", error);
    next(new CustomError(error.message));
  }
};

export const getAllocatedStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mentor = await User.findById(req.user._id);
    if (!mentor) {
      return next(new CustomError("User not exists", 400));
    }

    const { studentId } = req.query;

    if (studentId) {
      const student = await db
        .collection("users")
        .findOne({ _id: new mongoose.Types.ObjectId(studentId as string) });
      if (!student) {
        return next(new CustomError("Student not found", 404));
      }
      return res.status(200).json({ student });
    } else {
      const studentIds = mentor.students.map((student) => new mongoose.Types.ObjectId(student._id));
      if (studentIds.length === 0) {
        return next(new CustomError("No students allocated yet", 404));
      }

      const students = await db
        .collection("users")
        .find({ _id: { $in: studentIds } })
        .toArray();
      return res.status(200).json({ students });
    }
  } catch (error: any) {
    next(new CustomError(error.message, error.status || 500));
  }
};
