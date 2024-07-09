import { allocateStudentsToMentor } from "../functions/allocateStudents";
import { db } from "../db/db";
import Mentor from "../models/userModel";

export const watchMentorCollection = () => {
  const changeStream = Mentor.watch([], { fullDocument: 'updateLookup' });

  changeStream.on('change', async (change) => {
    try {
      // Check if the change is an update and if the status field is changed to 'Verified'
      if (change.operationType === 'update' && change.updateDescription && change.updateDescription.updatedFields && change.updateDescription.updatedFields.status === 'Verified') {
        const mentorId = change.documentKey._id;

          await allocateStudentsToMentor(mentorId);

      }
    } catch (error) {
      console.error('Error processing change stream:', error);
    }
  });

  changeStream.on('error', (error) => {
    console.error('Change stream error:', error);
  });
};
