"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allocateStudentsToMentor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../../db/db");
const userModel_1 = __importDefault(require("../../models/userModel"));
const allocateStudentsToMentor = async (mentorId) => {
    try {
        const Student = db_1.db.collection('users');
        const mentor = await userModel_1.default.findById(mentorId);
        console.log(mentor, "mentor");
        if (!mentor) {
            console.log('Mentor not found');
            return;
        }
        // Helper function to create tags
        const createTags = (competitiveExams, standards, gender) => {
            const tags = [];
            for (const exam of competitiveExams) {
                for (const standard of standards) {
                    tags.push(`${exam}${standard}${gender}`);
                }
            }
            return tags;
        };
        // Create all possible mentor tags
        const mentorTags = [
            ...createTags(mentor.preference.competitiveExam, mentor.preference.standard, mentor.about.gender || ''),
            ...createTags(mentor.preference.competitiveExam, mentor.preference.standard, '')
        ];
        // Find students with matching tags and no mentor assigned
        const queries = mentorTags.map(tag => {
            const match = tag.match(/([a-zA-Z]+)(\d+)([a-zA-Z]*)/);
            if (match) {
                const [exam, standard, gender] = match.slice(1, 4);
                const query = {
                    'academic.competitiveExam': exam,
                    'academic.standard': Number(standard),
                };
                if (gender) {
                    query['about.gender'] = gender;
                }
                console.log(query);
                return { $and: [query] };
            }
            return null;
        }).filter((query) => query !== null);
        const students = await Student.find({
            'mentor.id': null,
            $or: queries
        }).limit(30).toArray();
        if (students.length === 0) {
            console.log('No students found for allocation');
            return;
        }
        const studentIds = students.map(student => student._id);
        mentor.students = mentor.students || [];
        mentor.students.push(...studentIds.map(id => ({ id, gmeet: { tokens: {}, link: null } })));
        await mentor.save();
        await Student.updateMany({ _id: { $in: studentIds } }, { $set: { 'mentor.id': new mongoose_1.default.Schema.Types.ObjectId(mentor._id) } });
        console.log('Students allocated to mentor successfully');
    }
    catch (error) {
        console.error('Error allocating students to mentor:', error);
    }
};
exports.allocateStudentsToMentor = allocateStudentsToMentor;
