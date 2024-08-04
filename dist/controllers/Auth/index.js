"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.logout = exports.resetpassword = exports.forgotPassword = exports.login = exports.otpVerification = exports.resentOtp = exports.register = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const error_1 = require("../../middlewares/error");
const setCookie_1 = __importDefault(require("../../utils/setCookie"));
const generateOTP_1 = __importDefault(require("../../utils/generateOTP"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../../db/db");
const sendMail_1 = require("../../utils/sendMail");
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel_1.default.findOne({ email });
        if (user)
            return next(new error_1.CustomError("User already exists", 400));
        const OTP = (0, generateOTP_1.default)();
        // await otpQueue.add("otpVerify", {
        //   options: {
        //     email,
        //     subject: "Verification",
        //     message: `Your verification OTP for registration is ${OTP}`,
        //   },
        // });
        await (0, sendMail_1.sendMail)({
            email,
            subject: "Verification",
            message: OTP,
            tag: "otp"
        });
        const salt = crypto_1.default.randomBytes(16).toString("hex");
        crypto_1.default.pbkdf2(password, salt, 1000, 64, "sha512", async (err, derivedKey) => {
            const nameArray = name.split(" ");
            const newUser = {
                firstname: nameArray[0],
                lastname: nameArray.length > 1 ? nameArray.slice(1).join(' ') : null,
                email,
                password: derivedKey.toString("hex"),
                salt
            };
            // Save OTP and newUser data in the OTP collection
            const hashedOTP = crypto_1.default.createHash('sha256').update(OTP).digest('hex');
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            const existingOtpRecord = await db_1.db.collection("otps").findOne({ email });
            if (existingOtpRecord) {
                await db_1.db.collection("otps").updateOne({ email }, {
                    $set: {
                        otp: hashedOTP,
                        expiresAt,
                        newUser,
                    },
                });
            }
            else {
                await db_1.db.collection("otps").insertOne({
                    email,
                    otp: hashedOTP,
                    expiresAt,
                    newUser,
                });
            }
        });
        res.status(200)
            .cookie('email', email, {
            httpOnly: true,
            sameSite: "none",
            secure: true
        })
            .json({
            success: true,
            message: `Verification OTP sent to ${email}`,
        });
    }
    catch (error) {
        console.log(error);
        next(new error_1.CustomError(error.message));
    }
};
exports.register = register;
const resentOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const otpRecord = await db_1.db.collection("otps").findOne({ email });
        if (!otpRecord)
            return next(new error_1.CustomError("User not found", 404));
        const OTP = (0, generateOTP_1.default)();
        // await otpQueue.add("otpVerify", {
        //   options: {
        //     email,
        //     subject: "Verification",
        //     message: `Your verification OTP for registration is ${OTP}`,
        //   },
        // });
        await (0, sendMail_1.sendMail)({
            email,
            subject: "Verification",
            message: OTP,
            tag: "otp"
        });
        const hashedOTP = crypto_1.default.createHash('sha256').update(OTP).digest('hex');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await db_1.db.collection("otps").updateOne({ email }, {
            $set: {
                otp: hashedOTP,
                expiresAt,
            },
        });
        res.status(200).json({
            success: true,
            message: `OTP resent successfully to ${email}`,
        });
    }
    catch (error) {
        console.log(error);
        next(new error_1.CustomError(error.message));
    }
};
exports.resentOtp = resentOtp;
const otpVerification = async (req, res, next) => {
    try {
        const { otp, email } = req.body;
        const otpRecord = await db_1.db.collection("otps").findOne({ email });
        if (!otpRecord)
            return next(new error_1.CustomError("OTP not found", 404));
        const hashedOtp = crypto_1.default.createHash('sha256').update(otp).digest('hex');
        if (hashedOtp !== otpRecord.otp || otpRecord.expiresAt < new Date(Date.now())) {
            return next(new error_1.CustomError("Invalid or expired OTP", 400));
        }
        const newUser = otpRecord.newUser;
        const user = await userModel_1.default.create(newUser);
        await db_1.db.collection("otps").deleteOne({ email });
        (0, setCookie_1.default)({
            user,
            res,
            next,
            message: "Verification Success",
            statusCode: 200,
        });
    }
    catch (error) {
        console.log(error);
        next(new error_1.CustomError(error.message));
    }
};
exports.otpVerification = otpVerification;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel_1.default.findOne({ email }).select("+password");
        if (!user)
            return next(new error_1.CustomError("Email not registered", 404));
        const isMatched = await user.comparePassword(password);
        if (!isMatched)
            return next(new error_1.CustomError("Wrong password", 400));
        (0, setCookie_1.default)({
            user,
            res,
            next,
            message: "Login Success",
            statusCode: 200,
        });
    }
    catch (error) {
        console.log(error);
        next(new error_1.CustomError(error.message));
    }
};
exports.login = login;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModel_1.default.findOne({ email });
        if (!user)
            return next(new error_1.CustomError("Email not registered", 400));
        const resetToken = await user.getToken();
        await user.save(); //saving the token in user
        const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
        // await otpQueue.add("otpVerify", {
        //   options: {
        //     email: email,
        //     subject: "Password Reset",
        //     message: `You reset password link is here ${url}`,
        //   },
        // });
        await (0, sendMail_1.sendMail)({
            email,
            subject: "Password Reset",
            message: url,
            tag: 'password_reset'
        });
        res.status(200).json({
            success: true,
            message: `Reset password link sent to ${email}`,
        });
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.forgotPassword = forgotPassword;
const resetpassword = async (req, res, next) => {
    try {
        const resetToken = req.params.token;
        if (!resetToken)
            return next(new error_1.CustomError("Something went wrong", 400));
        const resetPasswordToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        const user = await userModel_1.default.findOne({
            resetPasswordToken,
            resetTokenExpiry: {
                $gt: Date.now(),
            },
        });
        if (!user)
            return next(new error_1.CustomError("Your link is expired! Try again", 400));
        const salt = crypto_1.default.randomBytes(16).toString("hex");
        crypto_1.default.pbkdf2(req.body.password, salt, 1000, 64, "sha512", async (err, derivedKey) => {
            if (err)
                return next(new error_1.CustomError(err.message, 500));
            user.password = derivedKey.toString("hex");
            user.salt = salt;
            user.resetPasswordToken = null;
            user.resetTokenExpiry = null;
            await user.save();
            res.status(200).json({
                success: true,
                message: "You password has been changed",
            });
        });
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.resetpassword = resetpassword;
const logout = async (req, res) => {
    res
        .status(200)
        .cookie("token", null, {
        expires: new Date(Date.now()),
    })
        .json({
        success: true,
        message: "Logged out",
    });
};
exports.logout = logout;
const getUser = async (req, res, next) => {
    try {
        const user = await userModel_1.default.findById(req.user._id);
        if (!user)
            return next(new error_1.CustomError("User not found", 400));
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.getUser = getUser;
