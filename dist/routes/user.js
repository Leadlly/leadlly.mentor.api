"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middlewares/checkAuth");
const User_1 = require("../controllers/User");
const lowercase_1 = __importDefault(require("../middlewares/lowercase"));
const router = express_1.default.Router();
router.post("/info/save", checkAuth_1.checkAuth, lowercase_1.default, User_1.mentorlInfo);
exports.default = router;
