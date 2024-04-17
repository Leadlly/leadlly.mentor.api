import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userModel = new Schema({
  firstName: {
    type: String,
    required: [true, "Please enter the first name"],
  },
  lastName: {
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
      required: true,
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Pre-save hook for email validation
userModel.pre('save', function (next) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    return next(new Error("Please enter a valid email address"));
  }
  next();
});

// Pre-save hook for password hashing
userModel.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = mongoose.model('User', userModel);

export default User;
