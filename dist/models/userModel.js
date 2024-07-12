"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
const pbkdf2Async = (0, util_1.promisify)(crypto_1.default.pbkdf2);
const mentorSchema = new mongoose_1.Schema({
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
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User',
                default: []
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
mentorSchema.methods.comparePassword = async function (candidatePassword) {
    const hashedPassword = await new Promise((resolve, reject) => {
        crypto_1.default.pbkdf2(candidatePassword, this.salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err)
                reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
    console.log(hashedPassword, "-------->", this.password);
    return hashedPassword === this.password;
};
mentorSchema.methods.getToken = async function () {
    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    return resetToken;
};
const Mentor = mongoose_1.default.model('Mentor', mentorSchema);
exports.default = Mentor;
