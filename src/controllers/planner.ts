import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";


export const createPlanner = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {date, day, students, topics} = req.body
        
        
    } catch (error: any) {
        next(new CustomError(error.message, 500))
    }
}