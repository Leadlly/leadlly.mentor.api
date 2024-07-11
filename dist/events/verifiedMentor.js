"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchMentorCollection = void 0;
const allocateStudents_1 = require("../functions/allocateStudents");
const userModel_1 = __importDefault(require("../models/userModel"));
const watchMentorCollection = () => {
    const changeStream = userModel_1.default.watch([], { fullDocument: 'updateLookup' });
    changeStream.on('change', async (change) => {
        try {
            // Check if the change is an update and if the status field is changed to 'Verified'
            if (change.operationType === 'update' && change.updateDescription && change.updateDescription.updatedFields && change.updateDescription.updatedFields.status === 'Verified') {
                const mentorId = change.documentKey._id;
                await (0, allocateStudents_1.allocateStudentsToMentor)(mentorId);
            }
        }
        catch (error) {
            console.error('Error processing change stream:', error);
        }
    });
    changeStream.on('error', (error) => {
        console.error('Change stream error:', error);
    });
};
exports.watchMentorCollection = watchMentorCollection;
