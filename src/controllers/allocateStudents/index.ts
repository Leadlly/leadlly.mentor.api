import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Mentor from '../../models/userModel';

const Student = mongoose.connection.collection('students');

export const allocateStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findOne({ _id: new mongoose.Types.ObjectId(studentId) });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.mentorId) {
      return res.status(400).json({ message: 'Student has a mentor' });
    }

    const availableMentor = await Mentor.findOne({
      tag: student.tag,
      $expr: { $lt: [{ $size: { $ifNull: ['$students', []] } }, 30] },
    });

    if (!availableMentor) {
      return res.status(404).json({ message: 'No available mentors found' });
    }

    availableMentor.students = availableMentor.students || [];
    availableMentor.students.push(student._id);

    await availableMentor.save();

    await Student.updateOne(
      { _id: student._id },
      { $set: { mentorId: availableMentor._id } }
    );

    res.status(200).json({ message: 'Student allocated to mentor successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
