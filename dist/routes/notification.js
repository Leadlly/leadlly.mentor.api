"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middlewares/checkAuth");
const Notifications_1 = require("../controllers/Notifications");
const router = express_1.default.Router();
router.post('/send', checkAuth_1.checkAuth, Notifications_1.sendNotification);
exports.default = router;
