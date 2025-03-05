import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { sendApiResponse, sendInternalErrorResponse} from '../utils/apiResponse';

export const validateRequest = (
   schema: Joi.ObjectSchema<any>,
) => {
   return (
      req: Request, 
      res: Response, 
      next: NextFunction
   ) => {
      try {
         const { error } = schema.validate(req.body, {
            abortEarly: false,
         });
         if (error !== undefined) {
            return sendApiResponse(res, {
               status: 400, 
               message: error.message
            });
         }
         return next();
      } catch(err) {
         console.log(err);
         sendInternalErrorResponse(err, res);
         return next(err)
      }
   }
}