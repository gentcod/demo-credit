import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateReqMiddleware';
import { AuthValidation } from '../validations/user.validation';

const authRouter = express.Router();
const authController = new AuthController();

authRouter.route('/signup').post(
   validateRequest(AuthValidation),
   authController.createUser,
);

authRouter.route('/login').post(
   validateRequest(AuthValidation),
   authController.loginUser,
);

export default authRouter;