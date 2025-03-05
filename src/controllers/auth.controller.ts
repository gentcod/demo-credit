import { Request, Response, NextFunction } from 'express';
import { sendApiResponse, sendInternalErrorResponse} from '../utils/apiResponse';
import { AuthServies } from '../services/auth.services';

export class AuthController {
   public async createUser(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await new AuthServies().createUser(req.body)
         
         return sendApiResponse(res, {
            status: result.status,
            message: result.message,
         });
      }
      catch (err) {
         sendInternalErrorResponse(res, err);
         next(err);
      }
   };

   public async loginUser(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await new AuthServies().loginUser(req.body)
         
         return sendApiResponse(res, {
            status: result.status,
            message: result.message,
            data: result.data,
         });
      }
      catch (err) {
         sendInternalErrorResponse(res, err);
         next(err);
      }
   };
}
