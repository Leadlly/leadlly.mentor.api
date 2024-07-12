"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllocatedStudents = exports.mentorlInfo = exports.mentorOauthCallback = exports.mentorOauth = void 0;
const getOauth_1 = require("../../services/Google/getOauth");
const userModel_1 = __importDefault(require("../../models/userModel"));
const error_1 = require("../../middlewares/error");
const db_1 = require("../../db/db");
const mongoose_1 = __importDefault(require("mongoose"));
const mentorOauth = async (req, res, next) => {
    try {
        const authUrl = getOauth_1.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar'],
        });
        res.redirect(authUrl);
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.mentorOauth = mentorOauth;
const mentorOauthCallback = async (req, res, next) => {
    try {
        const { code } = req.query;
        const { tokens } = await getOauth_1.oauth2Client.getToken(code);
        getOauth_1.oauth2Client.setCredentials(tokens);
        const user = await userModel_1.default.findById(req.user._id);
        if (!user)
            return next(new error_1.CustomError("User not exists", 400));
        user.gmeet.tokens = tokens;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Authorization successful'
        });
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.mentorOauthCallback = mentorOauthCallback;
const mentorlInfo = async (req, res, next) => {
    try {
        const bodyData = req.body;
        const user = (await userModel_1.default.findById(req.user._id));
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (bodyData.firstName) {
            user.firstname = bodyData.firstName;
        }
        if (bodyData.lastName) {
            user.lastname = bodyData.lastName;
        }
        if (bodyData.dateOfBirth) {
            user.about.dateOfBirth = bodyData.dateOfBirth;
        }
        if (bodyData.phone) {
            user.phone.personal = bodyData.phone;
        }
        if (bodyData.gender) {
            user.about.gender = bodyData.gender;
        }
        if (bodyData.address) {
            user.address.addressLine = bodyData.address;
        }
        if (bodyData.pinCode) {
            user.address.pincode = bodyData.pinCode;
        }
        if (bodyData.country) {
            user.address.country = bodyData.country;
        }
        if (bodyData.schoolOrCollegeName) {
            user.academic.schoolOrCollegeName = bodyData.schoolOrCollegeName;
        }
        if (bodyData.schoolOrCollegeAddress) {
            user.academic.schoolOrCollegeAddress = bodyData.schoolOrCollegeAddress;
        }
        if (bodyData.class) {
            user.preference.standard = bodyData.class;
        }
        if (bodyData.competitiveExams) {
            user.preference.competitiveExam = bodyData.competitiveExams;
        }
        await user.save();
        res.status(200).json({
            message: "Personal information updated",
            user,
        });
    }
    catch (error) {
        console.error("Error updating personal info:", error);
        next(new error_1.CustomError(error.message));
    }
};
exports.mentorlInfo = mentorlInfo;
const getAllocatedStudents = async (req, res, next) => {
    try {
        const mentor = await userModel_1.default.findById(req.user._id);
        if (!mentor) {
            return next(new error_1.CustomError("User not exists", 400));
        }
        const { studentId } = req.query;
        if (studentId) {
            const student = await db_1.db.collection("users").findOne({ _id: new mongoose_1.default.Types.ObjectId(studentId) });
            if (!student) {
                return next(new error_1.CustomError("Student not found", 404));
            }
            return res.status(200).json({ student });
        }
        else {
            const studentIds = mentor.students.map(student => student.id);
            if (studentIds.length === 0) {
                return next(new error_1.CustomError("No students allocated yet", 404));
            }
            const students = await db_1.db.collection("users").find({ _id: { $in: studentIds } }).toArray();
            return res.status(200).json({ students });
        }
    }
    catch (error) {
        next(new error_1.CustomError(error.message, error.status || 500));
    }
};
exports.getAllocatedStudents = getAllocatedStudents;
