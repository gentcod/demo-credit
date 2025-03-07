import { Router } from 'express';
import { AuthController } from '../../controllers/user.controller';
import { validateRequest } from '../../middlewares/validateReqMiddleware';
import { LoginValidation, SignUpValidation } from '../../validations/user.validation';


export class UserRoute {
   public router_: Router
   private _authController: AuthController

   constructor() {
      this.router_ = Router();
      this._authController = new AuthController();
      this.routes();
   }

   public get router(): Router {
      return this.router_;
   }

   routes() {
      this.router.route('/signup').post(
         validateRequest(SignUpValidation),
         this._authController.createUser,
      );

      this.router.route('/login').post(
         validateRequest(LoginValidation),
         this._authController.loginUser,
      );
   }

}
