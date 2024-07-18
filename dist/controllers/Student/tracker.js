"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentTracker = void 0;
const db_1 = require("../../db/db");
const error_1 = require("../../middlewares/error");
const mongoose_1 = __importDefault(require("mongoose"));
const getStudentTracker = async (req, res, next) => {
    try {
        const Tracker = db_1.db.collection("trackers");
        const tracker = await Tracker.find({ user: new mongoose_1.default.Types.ObjectId(req.params.id), "subject.name": req.query.subject }).toArray();
        if (!tracker) {
            return res.status(404).json({
                success: false,
                message: "No tracker data found for this user",
            });
        }
        return res.status(200).json({
            success: true,
            data: tracker,
        });
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.getStudentTracker = getStudentTracker;
