"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token)
            return next(new error_1.CustomError("Login First", 400));
        const secret = process.env.JWT_SECRET;
        if (!secret)
            return new error_1.CustomError("Jwt Secret not defined");
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = await userModel_1.default.findById(decoded._id);
    }
    catch (error) {
        next(new error_1.CustomError(error.message));
    }
};
exports.default = isAuthenticated;
