import mongoose from 'mongoose';

interface IAvatar {
  public_id: string;
  url: string;
}

interface IAbout {
  college: string;
  degree: string;
  dob: string;
}

interface IGMeet {
  tokens: {};
  link: string | null;
}

interface IUser extends mongoose.Document {
  firstname: string;
  lastname?: string;
  email: string;
  phone: {
    personal?: number;
    other?: number;
  };
  password?: string;
  salt?: string;
  avatar: IAvatar;
  about: IAbout;
  status: 'Verified' | 'Not Verified';
  gmeet: IGMeet;
  students: mongoose.Types.ObjectId[];
  createdAt: Date;
  resetPasswordToken?: string | null;

  resetTokenExpiry?: string | null;
  tag: "JEE" | "NEET" ;

  comparePassword(candidatePassword: string): Promise<boolean>;
  getToken(): Promise<string>;
}

export default IMentor;
