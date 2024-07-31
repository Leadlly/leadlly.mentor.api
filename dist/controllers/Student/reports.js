"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverallReport = exports.getMonthlyReport = exports.getWeeklyReport = void 0;
const moment_1 = __importDefault(require("moment"));
const db_1 = require("../../db/db");
const error_1 = require("../../middlewares/error");
const mongoose_1 = __importDefault(require("mongoose"));
const getWeeklyReport = async (req, res, next) => {
    try {
        const studentId = req.query.studentId;
        const StudentReport = db_1.db.collection("studentreports");
        const startDate = (0, moment_1.default)().startOf("isoWeek");
        const endDate = (0, moment_1.default)().endOf("isoWeek");
        const reports = await StudentReport.find({
            user: new mongoose_1.default.Types.ObjectId(studentId),
            date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        }).toArray();
        const daysInWeek = [];
        for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, "day")) {
            daysInWeek.push(date.clone());
        }
        const weeklyReport = {
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            days: daysInWeek.map((day) => {
                const report = reports.find((r) => (0, moment_1.default)(r.date).isSame(day, "day"));
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
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.getWeeklyReport = getWeeklyReport;
const getMonthlyReport = async (req, res, next) => {
    try {
        const studentId = req.query.studentId;
        const StudentReport = db_1.db.collection("studentreports");
        const startDate = (0, moment_1.default)().startOf("month");
        const endDate = (0, moment_1.default)().endOf("month");
        const reports = await StudentReport.find({
            user: new mongoose_1.default.Types.ObjectId(studentId),
            date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        }).toArray();
        const daysInMonth = [];
        for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, "day")) {
            daysInMonth.push(date.clone());
        }
        const monthlyReport = {
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            days: daysInMonth.map((day) => {
                const report = reports.find((r) => (0, moment_1.default)(r.date).isSame(day, "day"));
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
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.getMonthlyReport = getMonthlyReport;
const getOverallReport = async (req, res, next) => {
    try {
        const studentId = req.query.studentId;
        const StudentReport = db_1.db.collection("studentreports");
        const reports = await StudentReport.find({
            user: new mongoose_1.default.Types.ObjectId(studentId),
        }).toArray();
        if (!reports.length)
            return next(new error_1.CustomError("No reports found for the user"));
        const uniqueDates = Array.from(new Set(reports.map((report) => (0, moment_1.default)(report.date).format("YYYY-MM-DD"))));
        uniqueDates.sort((a, b) => (0, moment_1.default)(a).diff((0, moment_1.default)(b)));
        // Generate report
        const overallReport = uniqueDates.map((dateString) => {
            const dayReports = reports.filter((report) => (0, moment_1.default)(report.date).isSame(dateString, "day"));
            const aggregatedReport = dayReports.reduce((acc, report) => {
                acc.session += report.session;
                acc.quiz += report.quiz;
                acc.overall += report.overall;
                return acc;
            }, { session: 0, quiz: 0, overall: 0 });
            return {
                day: (0, moment_1.default)(dateString).format("dddd"),
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
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.getOverallReport = getOverallReport;
