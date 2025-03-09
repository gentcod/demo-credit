import { Router } from 'express';
import { TransferController } from '../../controllers/transfer.controller';
import { authMid } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../middlewares/validateReqMiddleware';
import { SendFundValidation } from '../../validations/transfer.validation';

export class TransferRoute {
   public router_: Router
   private _transferController: TransferController

   constructor() {
      this.router_ = Router();
      this._transferController = new TransferController();
      this.routes();
   }

   public get router(): Router {
      return this.router_;
   }

   routes() {
      this.router.route('/new').post(
         validateRequest(SendFundValidation),
         authMid,
         this._transferController.sendFund,
      );
   }

}
