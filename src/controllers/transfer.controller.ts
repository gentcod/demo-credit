import { Request, Response, NextFunction } from 'express';
import { sendApiResponse, sendInternalErrorResponse} from '../utils/apiResponse';
import { TransferServices } from '../services/transfer.services';

export class TransferController {
   public async sendFund(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await new TransferServices().sendFund(req.body, req.user_id)
         
         return sendApiResponse(res, {
            status: result.status,
            message: result.message,
            data: result.data
         });
      }
      catch (err) {
         sendInternalErrorResponse(res, err);
         next(err);
      }
   };
}
