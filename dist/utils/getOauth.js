"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauth2Client = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Missing Google API credentials in environment variables');
}
const oauth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
exports.oauth2Client = oauth2Client;
oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
