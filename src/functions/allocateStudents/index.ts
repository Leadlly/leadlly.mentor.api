import { query } from 'express';
import { db } from '../../db/db';
import Mentor from '../../models/userModel';

export const allocateStudentsToMentor = async (mentorId: string) => {
  try {
    const Student = db.collection('users');
    const mentor = await Mentor.findById(mentorId);

    console.log(mentor, "mentor")
    if (!mentor) {
      console.log('Mentor not found');
      return;
    }

    // Helper function to create tags
    const createTags = (competitiveExams: string[], standards: string[], gender: string) => {
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
      ...createTags(mentor.preference.competitiveExam, mentor.preference.standard, mentor.about.gender),
      ...createTags(mentor.preference.competitiveExam, mentor.preference.standard, '')
    ];

    console.log(mentorTags, "tags are here =======>")
    // Find students with matching tags and no mentor assigned
    const students = await Student.find({
      'mentor.id': null,
      $or: mentorTags.map(tag => {
        const match = tag.match(/([a-zA-Z]+)(\d+)([a-zA-Z]*)/);
        if (match) {
          const [exam, standard, gender] = match.slice(1, 4);
  
          const query: any = {
            'academic.competitiveExam': exam,
            'academic.standard': Number(standard),
          };
          if (gender) {
            query['about.gender'] = gender;
          }
          console.log(query)
          return { $and: [query] };
        }

        return null;
      }).filter(query => query !== null)
    }).limit(30).toArray();

    console.log("2222222 are here =======>")

    if (students.length === 0) {
      console.log('No students found for allocation');
      return;
    }

    const studentIds = students.map(student => student._id);

    // Ensure mentor.students is an array and push student IDs
    mentor.students = mentor.students || [];
    mentor.students.push(...studentIds.map(id => ({ id })));

    await mentor.save();

    await Student.updateMany(
      { _id: { $in: studentIds } },
      { $set: { 'mentor.id': mentor._id } }
    );

    console.log('Students allocated to mentor successfully');
  } catch (error) {
    console.error('Error allocating students to mentor:', error);
  }
};
