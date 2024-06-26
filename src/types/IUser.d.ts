import { Document } from "mongoose";

interface IUser extends Document {
  firstname: string;
  lastname?: string;
  email: string;
  phone?: {
    personal?: number;
    other?: number;
  };
  password: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  about?: {
    college?: string;
    degree?: string;
    dob?: string; 
  };
  status: "Verified" | "Not Verified";
  students?: mongoose.Schema.Types.ObjectId[];
  createdAt?: Date; 
  resetPasswordToken?: string | null;
  resetTokenExpiry?: string | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getToken(): Promise<string>;
}

export default IUser;
