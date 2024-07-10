"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.questions_db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let db;
let questions_db;
const ConnectToDB = async () => {
    const DatabaseUrl = process.env.LEADLLY_DB_URL;
    const questionsDbUrl = process.env.LEADLLY_QUESTIONS_DB_URL;
    try {
        await mongoose_1.default.connect(DatabaseUrl);
        exports.db = db = mongoose_1.default.connection;
        console.log("Leadlly_DB Connected.");
        exports.questions_db = questions_db = await mongoose_1.default.createConnection(questionsDbUrl);
        console.log("Questions_DB Connected.");
    }
    catch (error) {
        console.log("Error connecting to databases:", error);
    }
};
exports.default = ConnectToDB;
