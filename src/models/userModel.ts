import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import IUser from '../types/IUser';

const mentorSchema = new Schema({
  firstname: {
    type: String,
    required: [true, "Please enter the first name"],
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    personal: {
      type: Number,
    },
    other: Number,
  },
  password: {
    type: String,
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
  status: {
    type: String,
    enum: ["Verified", "Not Verified"],
    default: "Not Verified"
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: { type: String, default: null },
  resetTokenExpiry: { type: String, default: null },

});


// Pre-save hook for email validation
mentorSchema.pre("save", function (next) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    return next(new Error("Please enter a valid email address"));
  }
  next();
});

// Pre-save hook for password hashing
mentorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  if (!this.password) return;
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

mentorSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error comparing password.");
  }
};

mentorSchema.methods.getToken = async function (): Promise<string> {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model<IUser>('Mentor', mentorSchema);

export default User;
