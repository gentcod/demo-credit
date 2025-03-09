import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { sendApiResponse, sendInternalErrorResponse} from '../utils/apiResponse';

declare global {
   namespace Express {
      interface Request {
         limit?: number;
         offset?: number;
      }
   }
}

export const validateRequest = (
   schema: Joi.ObjectSchema<any>,
   schemeType: 'body' | 'query' | 'params' = 'body'
) => {
   return (
      req: Request, 
      res: Response, 
      next: NextFunction
   ) => {
      let data = {};
      if (schemeType === 'body') {
         data = req.body;
      } else if (schemeType === 'query') {
         data = req.query;
         req.limit = req.query.page_size ? parseInt(req.query.page_size as string) : undefined
         req.offset = req.query.page_id ? parseInt(req.query.page_id as string) : undefined

         req.limit = req.limit > 20 ? 20 : req.limit;
      } else {
         data = req.params;
      }

      try {
         const { error } = schema.validate(data, {
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