"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentInfo = void 0;
const error_1 = require("../../middlewares/error");
const db_1 = require("../../db/db");
const mongoose_1 = __importDefault(require("mongoose"));
const getStudentInfo = async (req, res, next) => {
    try {
        const studentId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(studentId)) {
            return next(new error_1.CustomError("Invalid student ID", 400));
        }
        const Student = db_1.db.collection("users");
        const student = await Student.findOne({ _id: new mongoose_1.default.Types.ObjectId(studentId) });
        if (!student) {
            return next(new error_1.CustomError("Student not found", 404));
        }
        res.status(200).json({
            success: true,
            data: student
        });
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.getStudentInfo = getStudentInfo;
