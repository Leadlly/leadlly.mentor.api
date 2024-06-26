"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpWorker = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = require("dotenv");
const sendMail_1 = require("../../utils/sendMail");
(0, dotenv_1.config)();
const redisUri = process.env.REDIS_URI;
const connection = new ioredis_1.default(redisUri, { maxRetriesPerRequest: null });
exports.otpWorker = new bullmq_1.Worker("otp-queue", async (job) => {
    await (0, sendMail_1.sendMail)(job.data?.options);
}, { connection });
