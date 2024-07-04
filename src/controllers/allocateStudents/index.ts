import Mentor from "../../models/userModel";
//import Student from  "../models/userModel"


export const allocateStudents = async () => {
    try {
        const unallocatedStudents = await Student.find({mentorId: {$exists: false}});

        const mentors = await Mentor.find();

        const mentorStudentCount: {[key:string]: number} ={};
        mentors.forEach((mentor) => {
            mentorStudentCount[mentor._id.toString()] = mentor.students.length;
        });

        for (const student of unallocatedStudents){
            const {tag} = student;

            const availableMentor = mentors.find((mentor) => mentor.tag === tag && mentorStudentCount[mentor._id.toString()] < 30);
            if (availableMentor) {
                student.mentorId = availableMentor._id;
                await student.save();


                availableMentor.students.push(student._id);
                await availableMentor.save();

                mentorStudentCount[availableMentor._id.toString()] +=1;
            } else {
                console.log(`No available mentor for student ${student._id} tag ${tag}`)
            }
        }

        console.log('Student allocation completed successfully.');
    } catch (error) {
        console.log('Error allocating students to mentors:', error);
    }
};