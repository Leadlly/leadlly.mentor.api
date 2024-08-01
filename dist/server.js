"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const app_1 = require("./app");
const db_1 = __importDefault(require("./db/db"));
const verifiedMentor_1 = require("./events/verifiedMentor");
const worker_1 = require("./services/bullmq/worker");
const winstonLogger_1 = require("./utils/winstonLogger");
const serverless_http_1 = __importDefault(require("serverless-http"));
const port = process.env.PORT || 4001;
//Database
(0, db_1.default)();
//event for mentor collection
(0, verifiedMentor_1.watchMentorCollection)();
worker_1.otpWorker;
const handler = (0, serverless_http_1.default)(app_1.app);
exports.handler = handler;
app_1.app.listen(port, () => winstonLogger_1.logger.info(`Server is running on port ${port}`));
