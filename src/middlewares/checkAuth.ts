import { NextFunction, Request, Response } from "express";
import { CustomError } from "./error";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;
  if (!token) return next(new CustomError("Login First", 400));

  const secret = process.env.JWT_SECRET;
  if (!secret) return next(new CustomError("Jwt Secret not defined"));

  const decoded = jwt.verify(token, secret) as JwtPayload;
  req.user = await User.findById(decoded._id);

  next();
};

export const isVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.status !== "Verified")
    return next(new CustomError("Your are not verified", 400));

  next();
};