import moment from "moment";
import { Request, Response, NextFunction } from "express";
import { db } from "../../db/db";
import { CustomError } from "../../middlewares/error";
import mongoose from "mongoose";
export const getWeeklyReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.query.studentId as string | undefined;
    const StudentReport = db.collection("studentreports");
    const startDate = moment().startOf("isoWeek");
    const endDate = moment().endOf("isoWeek");

    const reports = await StudentReport.find({
      user: new mongoose.Types.ObjectId(studentId),
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    }).toArray();

    const daysInWeek = [];
    for (
      let date = startDate.clone();
      date.isSameOrBefore(endDate);
      date.add(1, "day")
    ) {
      daysInWeek.push(date.clone());
    }

    const weeklyReport = {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      days: daysInWeek.map((day) => {
        const report = reports.find((r) => moment(r.date).isSame(day, "day"));
        return {
          day: day.format("dddd"),
          date: day.format("YYYY-MM-DD"),
          session: report ? report.session : 0,
          quiz: report ? report.quiz : 0,
          overall: report ? report.overall : 0,
        };
      }),
    };

    res.status(200).json({
      success: true,
      weeklyReport,
    });
  } catch (error) {
    next(new CustomError((error as Error).message));
  }
};

export const getMonthlyReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.query.studentId as string | undefined;
    const StudentReport = db.collection("studentreports");

    const startDate = moment().startOf("month");
    const endDate = moment().endOf("month");

    const reports = await StudentReport.find({
      user: new mongoose.Types.ObjectId(studentId),
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    }).toArray();

    const daysInMonth = [];
    for (
      let date = startDate.clone();
      date.isSameOrBefore(endDate);
      date.add(1, "day")
    ) {
      daysInMonth.push(date.clone());
    }

    const monthlyReport = {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      days: daysInMonth.map((day) => {
        const report = reports.find((r) => moment(r.date).isSame(day, "day"));
        return {
          day: day.format("dddd"),
          date: day.format("YYYY-MM-DD"),
          session: report ? report.session : 0,
          quiz: report ? report.quiz : 0,
          overall: report ? report.overall : 0,
        };
      }),
    };

    res.status(200).json({
      success: true,
      monthlyReport,
    });
  } catch (error) {
    next(new CustomError((error as Error).message));
  }
};

export const getOverallReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.query.studentId as string | undefined;
    const StudentReport = db.collection("studentreports");

    const reports = await StudentReport.find({
      user: new mongoose.Types.ObjectId(studentId),
    }).toArray();

    if (!reports.length)
      return next(new CustomError("No reports found for the user"));

    const uniqueDates = Array.from(
      new Set(reports.map((report) => moment(report.date).format("YYYY-MM-DD")))
    );

    uniqueDates.sort((a, b) => moment(a).diff(moment(b)));

    // Generate report
    const overallReport = uniqueDates.map((dateString) => {
      const dayReports = reports.filter((report) =>
        moment(report.date).isSame(dateString, "day")
      );
      const aggregatedReport = dayReports.reduce(
        (acc, report) => {
          acc.session += report.session;
          acc.quiz += report.quiz;
          acc.overall += report.overall;
          return acc;
        },
        { session: 0, quiz: 0, overall: 0 }
      );

      return {
        day: moment(dateString).format("dddd"),
        date: dateString,
        session: aggregatedReport.session,
        quiz: aggregatedReport.quiz,
        overall: aggregatedReport.overall,
      };
    });

    res.status(200).json({
      success: true,
      overallReport,
    });
  } catch (error) {
    next(new CustomError((error as Error).message));
  }
};
