"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = __importStar(require("./db/db"));
const verifiedMentor_1 = require("./events/verifiedMentor");
const worker_1 = require("./services/bullmq/worker");
const port = process.env.PORT || 4001;
//Database
(0, db_1.default)();
// Redis
// connectToRedis()
db_1.questions_db.on("connected", () => {
    console.log("Question_DB connected");
});
//event for mentor collection
(0, verifiedMentor_1.watchMentorCollection)();
worker_1.otpWorker;
app_1.app.listen(port, () => console.log(`Server is working on port ${port}`));
