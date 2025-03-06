import express from 'express';
import { AuthController } from '../controllers/user.controller';
import { validateRequest } from '../middlewares/validateReqMiddleware';
import { SignUpValidation, LoginValidation } from '../validations/user.validation';

const authRouter = express.Router();
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