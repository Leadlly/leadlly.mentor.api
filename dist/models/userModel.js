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
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const mentorSchema = new mongoose_1.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId
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
    if (!this.isModified("password"))
        return next();
    const salt = await bcrypt_1.default.genSalt(10);
    if (!this.password)
        return;
    this.password = await bcrypt_1.default.hash(this.password, salt);
    next();
});
mentorSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt_1.default.compare(candidatePassword, this.password);
    }
    catch (error) {
        throw new Error("Error comparing password.");
    }
};
mentorSchema.methods.getToken = async function () {
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const User = mongoose_1.default.model('Mentor', mentorSchema);
exports.default = User;
