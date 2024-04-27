import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const mentorSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter the first name"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    personal: {
      type: Number,
      unique: true,
    },
    other: Number,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
  },
  about: {
    college: String,
    degree: String,
    dob: String,
  },
  role: {
    type: String,
    default: "mentor",
  },
  status: {
    type: String,
    enum: ["Verified, Not Verified"],
    default: "Not Verified"
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Pre-save hook for email validation
mentorSchema.pre('save', function (next) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    return next(new Error("Please enter a valid email address"));
  }
  next();
});

// Pre-save hook for password hashing
mentorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;
