import { Router } from 'express';
import { AuthController } from '../controllers/user.controller';
import { validateRequest } from '../middlewares/validateReqMiddleware';
import { LoginValidation, SignUpValidation } from '../validations/user.validation';

const authRouter = Router();
const authController = new AuthController();

authRouter.route('/signup').post(
   validateRequest(SignUpValidation),
   authController.createUser,
);

authRouter.route('/login').post(
   validateRequest(LoginValidation),
   authController.loginUser,
);

export default authRouter;