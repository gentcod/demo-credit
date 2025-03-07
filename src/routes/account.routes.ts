import { Router } from 'express';
import { validateRequest } from '../middlewares/validateReqMiddleware';
import { AccountController } from '../controllers/account.controller';
import { CreateAccountValidation, FundAccountValidation } from '../validations/account.validation';
import { authMid } from '../middlewares/authMiddleware';

export class AccountRoute {
   public router_: Router
   private _accountController: AccountController

   constructor() {
      this.router_ = Router();
      this._accountController = new AccountController();
      this.routes();
   }

   public get router(): Router {
      return this.router_;
   }

   routes() {
      this.router.route('/new').post(
         validateRequest(CreateAccountValidation),
         authMid,
         this._accountController.createAccount,
      );

      this.router.route('/fund').patch(
         validateRequest(FundAccountValidation),
         authMid,
         this._accountController.fundAccount,
      );
   }

}
