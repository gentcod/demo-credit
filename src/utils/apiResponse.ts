import { Response } from "express";
import logger from "./logger";

type ApiResponse<T> = {
   status: number;
   message: string;
   data?: T,
}

type ApiServiceSuccessData<T> = {
   responseCode: number;
   message: string;
   data: T;
}

type ApiServiceErrorData = {
   responseCode: number;
   message: string;
}

type ErrorHandler<T extends Error> = (res: Response, err: T) => void;

function sendSuccessResponse<T>(
   res: Response,
   data: ApiServiceSuccessData<T>,
) {
   return res.status(data.responseCode).json({
      status: 'success',
      responseCode: data.responseCode,
      message: data.message,
      data: data.data
   });  
}

function sendErrorResponse (
   res: Response,
   errorData: ApiServiceErrorData,
) {
   return res.status(errorData.responseCode).json({
      status: 'error',
      responseCode: errorData.responseCode, 
      message: errorData.message
   });  
}

export function sendApiResponse<T>(res: Response, data: ApiResponse<T>){
   if (data.status < 300) {
      return sendSuccessResponse(res, {
         responseCode: data.status,
         message: data.message,
         data: data.data
      })
   }
   return sendErrorResponse(res, {
      responseCode: data.status,
      message: data.message
   })
}

export const sendInternalErrorResponse: ErrorHandler<any> = (
   res,
   err,
) => {
   logger.warn(err)   
   return res.status(500).json({
      status: 'error',
      responseCode: 500, 
      message: "An internal error occurred, bear with us"
   });
}
