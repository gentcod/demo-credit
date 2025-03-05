import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { sendApiResponse, sendInternalErrorResponse } from '../utils/apiResponse';
import { verifyJwt } from "../utils/jwt";

declare global {
   namespace Express {
      interface Request {
         email?: string;
      }
   }
}

const authTypeBearer = 'bearer';
export interface AuthPayload extends JwtPayload {
   email: string;
}

export const authMid = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return sendApiResponse(res, {
            status: 401,
            message: 'Authorization header is not provided'
         });
      }

      const authFields = authHeader!.split(' ');
      if (authFields.length < 0) {
         return sendApiResponse(res, {
            status: 401,
            message: 'Invlaid authorization format'
         });
      }

      const authType = authFields[0].toLowerCase();
      if (authType !== authTypeBearer) {
         return sendApiResponse(res, {
            status: 401,
            message: `Invlaid authorization type: ${authType}`
         });
      }

      const token = authFields[1];
      const payload = verifyJwt(token) as AuthPayload;

      const payloadErr = (payload as JwtPayload).error
      if (payloadErr) {
         return sendApiResponse(res, {
            status: (payload as JwtPayload).status,
            message: `Access denied: ${payloadErr.message}`,
         })
      }

      req.email = payload.email;
      return next()
   } catch (err) {
      sendInternalErrorResponse(err, res)
      return next(err)
   }
}