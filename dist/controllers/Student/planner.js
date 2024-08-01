"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentPlanner = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const db_1 = require("../../db/db");
const error_1 = require("../../middlewares/error");
const mongoose_1 = __importDefault(require("mongoose"));
const getStudentPlanner = async (req, res, next) => {
    try {
        const Planner = db_1.db.collection('planners');
        const userId = req.params.id;
        // Extract startDate and endDate from the request body
        const { startDate: requestStartDate, endDate: requestEndDate } = req.body;
        let startDate, endDate;
        if (requestStartDate && requestEndDate) {
            // Convert provided startDate and endDate to Asia/Kolkata timezone and then to UTC
            startDate = (0, moment_timezone_1.default)(requestStartDate).tz("Asia/Kolkata").startOf("day").utc().toDate();
            endDate = (0, moment_timezone_1.default)(requestEndDate).tz("Asia/Kolkata").endOf("day").utc().toDate();
        }
        else {
            // Default to current week in Asia/Kolkata timezone and convert to UTC
            startDate = (0, moment_timezone_1.default)().tz("Asia/Kolkata").startOf("isoWeek").utc().toDate();
            endDate = (0, moment_timezone_1.default)(startDate).endOf("isoWeek").utc().toDate();
        }
        // Query the database using UTC dates
        const planner = await Planner.findOne({
            student: new mongoose_1.default.Types.ObjectId(userId),
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
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.getStudentPlanner = getStudentPlanner;
