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
                    const genderPart = gender ? gender : '';
                    tags.push(`${exam}${standard}${genderPart}`);
                }
            }
            return tags;
        };
        const { competitiveExam, standard } = mentor.preference;
        const gender = mentor.about.gender || '';
        let mentorTags = [];
        // If only one competitive exam is selected, create tags only for that exam
        if (competitiveExam.length === 1) {
            mentorTags = createTags(competitiveExam, standard, gender);
        }
        else {
            // Create all possible mentor tags if multiple competitive exams are selected
            mentorTags = [
                ...createTags(competitiveExam, standard, gender),
                ...createTags(competitiveExam, standard, '')
            ];
        }
        console.log('Generated mentor tags:', mentorTags);
        // Find students with matching tags, no mentor assigned, and not disabled
        const queries = mentorTags.map(tag => {
            const match = tag.match(/([a-zA-Z]+)(\d+)([a-zA-Z]*)/);
            if (match) {
                const [exam, standard, gender] = match.slice(1, 4);
                const query = {
                    'academic.competitiveExam': exam,
                    'academic.standard': Number(standard),
                    'disabled': { $ne: true } // Exclude students with disabled: true
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
        await Student.updateMany({ _id: { $in: studentIds } }, { $set: { 'mentor.id': new mongoose_1.default.Types.ObjectId(mentor._id) } });
        console.log('Students allocated to mentor successfully');
    }
    catch (error) {
        console.error('Error allocating students to mentor:', error);
    }
};
exports.allocateStudentsToMentor = allocateStudentsToMentor;
