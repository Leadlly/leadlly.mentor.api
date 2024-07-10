import mongoose from 'mongoose';

interface IAvatar {
  public_id: string;
  url: string;
}

interface IAbout {
  dateOfBirth: string | null;
  gender: string | null;
}

interface IAcademic {
  schoolOrCollegeName: string | null;
  schoolOrCollegeAddress: string | null;
  degree: string | null;
}

interface IAddress {
  country: string | null;
  addressLine: string | null;
  pincode: number | null;
}

interface IPhone {
  personal: number | null;
  other: number | null;
}

interface IGMeet {
  tokens: Record<string, any>;
  link: string | null;
}

interface IStudent {
  id: mongoose.Types.ObjectId;
  gmeet: IGMeet;
}

interface IUser extends mongoose.Document {
  firstname: string | null;
  lastname: string | null;
  email: string;
  phone: IPhone;
  password?: string | null;
  salt?: string | null;
  address: IAddress;
  avatar: IAvatar;
  about: IAbout;
  academic: IAcademic;
  status: 'Verified' | 'Not Verified';
  gmeet: IGMeet;
  preference: {
    standard: string[];
    competitiveExam: string[];
  };
  students: IStudent[];
  createdAt: Date;
  resetPasswordToken?: string | null;
  resetTokenExpiry?: Date | null;

  comparePassword(candidatePassword: string): Promise<boolean>;
  getToken(): Promise<string>;
}

export default IUser;
