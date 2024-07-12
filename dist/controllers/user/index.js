"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorOauthCallback = exports.mentorOauth = void 0;
const getOauth_1 = require("../../services/Google/getOauth");
const userModel_1 = __importDefault(require("../../models/userModel"));
const error_1 = require("../../middlewares/error");
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
