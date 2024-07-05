
import { google } from 'googleapis';
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
  
  
    const user: IUser = await User.findById(req.user._id)
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