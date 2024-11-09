import mongoose from 'mongoose';
import { db } from '../../db/db';
import Mentor from '../../models/userModel';

interface StudentQuery {
  $and: {
    [key: string]: any;
  }[];
}

export const allocateStudentsToMentor = async (mentorId: string) => {
  try {
    const Student = db.collection('users');
    const mentor = await Mentor.findById(mentorId);

    console.log(mentor, "mentor");
    if (!mentor) {
      console.log('Mentor not found');
      return;
    }

    // Helper function to create tags
    const createTags = (competitiveExams: string[], standards: string[], gender: string) => {
      const tags: string[] = [];
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

    let mentorTags: string[] = [];

    // If only one competitive exam is selected, create tags only for that exam
    if (competitiveExam.length === 1) {
      mentorTags = createTags(competitiveExam, standard, gender);
    } else {
      // Create all possible mentor tags if multiple competitive exams are selected
      mentorTags = [
        ...createTags(competitiveExam, standard, gender),
        ...createTags(competitiveExam, standard, '')
      ];
    }

    console.log('Generated mentor tags:', mentorTags);

    // Find students with matching tags, no mentor assigned, and not disabled
    const queries: StudentQuery[] = mentorTags.map(tag => {
      const match = tag.match(/([a-zA-Z]+)(\d+)([a-zA-Z]*)/);
      if (match) {
        const [exam, standard, gender] = match.slice(1, 4);

        const query: any = {
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
    }).filter((query): query is StudentQuery => query !== null);

    let students = await Student.find({
      'mentor.id': null,
      $or: queries
    }).limit(30).toArray();

    if (students.length === 0) {
      console.log('No students found for allocation');
      return;
    }

    // If only one competitive exam is selected, prioritize male students first
    if (competitiveExam.length === 1) {
      students.sort((a, b) => {
        if (a.about.gender === 'male' && b.about.gender === 'female') {
          return -1;
        } else if (a.about.gender === 'female' && b.about.gender === 'male') {
          return 1;
        } else {
          return 0;
        }
      });
    }

    const studentIds = students.map(student => student._id);

    // Filter out students already assigned to the mentor
    const existingStudentIds = mentor.students?.map(student => student._id) || [];
    const newStudentIds = studentIds.filter(id => !existingStudentIds.includes(id));

    // Calculate how many more students are needed to reach 30
    const currentCount = existingStudentIds.length;
    const neededCount = 30 - currentCount;

    const studentsToAdd = newStudentIds.slice(0, neededCount);

    if (studentsToAdd.length === 0) {
      console.log('No new students to add');
      return;
    }

    mentor.students = mentor.students || [];
    mentor.students.push(
      ...studentsToAdd.map(id => ({ _id: id, gmeet: { tokens: {}, link: null } }))
    );

    await mentor.save();

    await Student.updateMany(
      { _id: { $in: studentsToAdd } },
      { $set: { 'mentor.id': new mongoose.Types.ObjectId(mentor._id) } }
    );

    console.log('Students allocated to mentor successfully');
  } catch (error) {
    console.error('Error allocating students to mentor:', error);
  }
};
