"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const error_1 = require("../middlewares/error");
const register = async (req, res, next) => {
    try {
    }
    catch (error) {
        console.log(error);
        next(new error_1.CustomError(error.message));
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
    }
    catch (error) {
        console.log(error);
        next(new error_1.CustomError(error.message));
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
    }
    catch (error) {
        console.log(error);
        next(new error_1.CustomError(error.message));
    }
};
exports.logout = logout;
