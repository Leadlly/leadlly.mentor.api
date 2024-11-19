"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middlewares/checkAuth");
const lowercase_1 = __importDefault(require("../middlewares/lowercase"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
router.post("/info/save", checkAuth_1.checkAuth, lowercase_1.default, user_1.mentorlInfo);
router.get("/getstudents", checkAuth_1.checkAuth, user_1.getAllocatedStudents);
router.post("/create/notification", checkAuth_1.checkAuth, user_1.createNotification);
exports.default = router;
