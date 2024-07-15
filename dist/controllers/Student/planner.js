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
        const startDate = (0, moment_timezone_1.default)().startOf("isoWeek").toDate();
        const endDate = (0, moment_timezone_1.default)(startDate).endOf("isoWeek").toDate();
        const planner = await Planner.findOne({
            student: new mongoose_1.default.Types.ObjectId(userId),
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
    }
    catch (error) {
        console.error(error);
        next(new error_1.CustomError(error.message));
    }
};
exports.getStudentPlanner = getStudentPlanner;
