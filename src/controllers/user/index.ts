
import { oauth2Client } from '../../services/Google/getOauth';
import { NextFunction, Request, Response } from 'express';
import User from '../../models/userModel';
import { CustomError } from '../../middlewares/error';
import IUser from '../../types/IUser';

export const mentorOauth = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar'],
          });
          res.redirect(authUrl);
    } catch (error: any) {
        next(new CustomError(error.message))
    }
}

export const mentorOauthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
  
  
    const user = await User.findById(req.user._id) as IUser
    if(!user) return next(new CustomError("User not exists", 400))
  
    user.gmeet.tokens = tokens
    await user.save()
  
    res.status(200).json({
      success: true,
      message: 'Authorization successful'
    });
  } catch (error: any) {
    next(new CustomError(error.message))
  }
}


export const mentorlInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bodyData = req.body;
    const user = (await User.findById(req.user._id)) as IUser;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (bodyData.firstName) {
      user.firstname = bodyData.firstName;
    }

    if (bodyData.lastName) {
      user.lastname = bodyData.lastName;
    }

    if (bodyData.dateOfBirth) {
      user.about.dateOfBirth = bodyData.dateOfBirth;
    }

    if (bodyData.phone) {
      user.phone.personal = bodyData.phone;
    }

    if (bodyData.gender) {
      user.about.gender = bodyData.gender;
    }

    if (bodyData.address) {
      user.address.addressLine = bodyData.address;
    }

    if (bodyData.pinCode) {
      user.address.pincode = bodyData.pinCode;
    }

    if (bodyData.country) {
      user.address.country = bodyData.country;
    }

    if (bodyData.schoolOrCollegeName) {
      user.academic.schoolOrCollegeName = bodyData.schoolOrCollegeName;
    }

    if (bodyData.schoolOrCollegeAddress) {
      user.academic.schoolOrCollegeAddress = bodyData.schoolOrCollegeAddress;
    }

    if (bodyData.standard) {
      user.preference.standard = bodyData.standard;
    }

    if (bodyData.competitiveExam) {
      user.preference.competitiveExam = bodyData.competitiveExam;
    }

    await user.save();

    res.status(200).json({
      message: "Personal information updated",
      user,
    });
  } catch (error: any) {
    console.error("Error updating personal info:", error);
    next(new CustomError(error.message))
  }
};
