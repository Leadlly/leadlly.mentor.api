"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    mentorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    url: [{ type: String }],
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
exports.Notification = mongoose_1.default.model('Notification', notificationSchema);
