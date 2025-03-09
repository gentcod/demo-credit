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
         const result = await new AccountServies().updateBalance({user_id: req.user_id, ...req.body})
         
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

   public async withdraw(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await new AccountServies().updateBalance({user_id: req.user_id, ...req.body}, true)
         
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

   public async getAccounts(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await new AccountServies().getAccounts(req.user_id)
         
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

   public async getAccount(req: Request, res: Response, next: NextFunction) {
      try {
         const currency = req.params.currency as string;         
         const result = await new AccountServies().getAccount(req.user_id, currency)
         
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
   
   public async getTransactions(req: Request, res: Response, next: NextFunction) {
      try {
         const currency = req.query.currency as string;         
         const result = await new AccountServies().getTransactions(req.user_id, currency)
         
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

   public async getSingleTransaction(req: Request, res: Response, next: NextFunction) {
      try {
         const transactionId = req.params.transactionId as string;         
         const result = await new AccountServies().getSingleTransaction(req.user_id, transactionId)
         
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
