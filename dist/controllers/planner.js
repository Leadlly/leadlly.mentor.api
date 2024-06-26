"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlanner = exports.createPlanner = void 0;
const error_1 = require("../middlewares/error");
const mongoose_1 = __importDefault(require("mongoose"));
const createPlanner = async (req, res, next) => {
    try {
        let bodydata = req.body;
        // console.log(bodydata);
        for (let student_id of bodydata.students) {
            console.log(student_id);
            // Convert student_id to ObjectId
            const objectId = new mongoose_1.default.Types.ObjectId(student_id);
            const student = await mongoose_1.default.connection.collection("users").findOne({ _id: objectId });
            if (!student)
                return next(new error_1.CustomError("Student not exists", 404));
            const plannersCollection = mongoose_1.default.connection.collection("planners");
            const existingPlanner = await plannersCollection.findOne({
                students: { $in: [student_id] },
                date: bodydata.date,
                day: bodydata.day
            });
            if (existingPlanner)
                return next(new error_1.CustomError(`Planner for date ${bodydata.date} already exists`));
            const planner = await plannersCollection.insertOne({
                ...bodydata,
                createdBy: req.user._id,
                createdAt: Date.now()
            });
            res.json({ planner });
        }
    }
    catch (error) {
        next(new error_1.CustomError(error.message, 500));
    }
};
exports.createPlanner = createPlanner;
const updatePlanner = async (req, res, next) => {
    try {
    }
    catch (error) {
        next(new error_1.CustomError(error.message, 500));
    }
};
exports.updatePlanner = updatePlanner;
