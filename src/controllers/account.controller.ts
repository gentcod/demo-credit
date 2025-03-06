import { Request, Response, NextFunction } from 'express';
import { sendApiResponse, sendInternalErrorResponse} from '../utils/apiResponse';
import { AccountServies } from '../services/account.services';

export class AccountController {
   public async createAccount(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await new AccountServies().createAccount({email: req.email, ...req.body})
         
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

   public async fundAccount(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await new AccountServies().fundAccount({user_id: req.user_id, ...req.body})
         
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
