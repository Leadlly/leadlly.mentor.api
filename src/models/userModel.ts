import mongoose, { Schema } from 'mongoose';
import IUser from '../types/IUser';
import crypto from "crypto";
import { promisify } from "util";

const pbkdf2Async = promisify(crypto.pbkdf2);

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
  salt: {
    type: String,
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
// mentorSchema.pre<IUser>("save", async function (next) {
//   if (!this.isModified("password")) return next();

//     const salt = crypto.randomBytes(16).toString("hex");
//     this.salt = salt;

//     const derivedKey = await pbkdf2Async(
//       this.password,
//       salt,
//       1000,
//       64,
//       "sha512",
//     );
//     this.password = derivedKey.toString("hex");

//     next();
// });

mentorSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
    const hashedPassword = await new Promise((resolve, reject) => {
      crypto.pbkdf2(
        candidatePassword,
        this.salt,
        1000,
        64,
        "sha512",
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(derivedKey.toString("hex"));
        },
      );
    });

    return hashedPassword === this.password;
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
