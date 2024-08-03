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
        const Planner = db_1.db.collection("planners");
        const userId = req.params.id;
        // Extract startDate and endDate from the request body
        const { startDate: requestStartDate, endDate: requestEndDate } = req.body;
        let startDate, endDate;
        if (requestStartDate && requestEndDate) {
            // Convert provided startDate and endDate to IST
            startDate = (0, moment_timezone_1.default)(requestStartDate).tz("Asia/Kolkata").startOf("day").toDate();
            endDate = (0, moment_timezone_1.default)(requestEndDate).tz("Asia/Kolkata").endOf("day").toDate();
        }
        else {
            // Default to current week
            startDate = (0, moment_timezone_1.default)().tz("Asia/Kolkata").startOf("isoWeek").toDate();
            endDate = (0, moment_timezone_1.default)(startDate).tz("Asia/Kolkata").endOf("isoWeek").toDate();
        }
        const planner = await Planner.findOne({
            student: new mongoose_1.default.Types.ObjectId(userId),
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
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.getStudentPlanner = getStudentPlanner;
