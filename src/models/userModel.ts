import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';
import { promisify } from 'util';
import IUser from '../types/IUser';

const pbkdf2Async = promisify(crypto.pbkdf2);

const mentorSchema = new Schema({
  firstname: {
    type: String,
    required: [true, "Please enter your name"],
    default: null,
  },
  lastname: {
    type: String,
    default: null,
  },
  email: { type: String, required: true, unique: true, default: null },

  phone: {
    personal: { type: Number, default: null },
    other: { type: Number, default: null },
  },
  password: {
    type: String,
    select: false,
    default: null,
  },
  salt: {
    type: String,
    default: null,
  },
  address: {
    country: { type: String, default: null },
    addressLine: { type: String, default: null },
    pincode: { type: Number, default: null },
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
    dateOfBirth: { type: String, default: null },
    gender: { type: String, default: null },
  },
  academic: {
    schoolOrCollegeName: { type: String, default: null },
    schoolOrCollegeAddress: { type: String, default: null },
    degree: { type: String, default: null },
  },
  status: {
    type: String,
    enum: ['Verified', 'Not Verified'],
    default: 'Not Verified',
  },
  gmeet: {
    tokens: {},
    link: {
      type: String,
      default: null,
    },
  },
  preference: {
    standard: Array,
    competitiveExam: Array
  },
  students: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    gmeet: {
      tokens: {},
      link: {
        type: String,
        default: null,
      },
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetTokenExpiry: {
    type: Date,
    default: null,
  },
});

mentorSchema.pre('save', function (next) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    return next(new Error('Please enter a valid email address'));
  }
  next();
});

// mentorSchema.pre<IUser>('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   const salt = crypto.randomBytes(16).toString('hex');
//   this.salt = salt;

//   const derivedKey = await pbkdf2Async(
//     this.password,
//     salt,
//     1000,
//     64,
//     'sha512'
//   );
//   this.password = derivedKey.toString('hex');

//   next();
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
      'sha512',
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      }
    );
  });

  console.log(hashedPassword, "-------->",  this.password)
  return hashedPassword === this.password;
};

mentorSchema.methods.getToken = async function (): Promise<string> {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  return resetToken;
};

const Mentor = mongoose.model<IUser>('Mentor', mentorSchema);

export default Mentor;
