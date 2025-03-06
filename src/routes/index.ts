import express from 'express';
import authRouter from './auth.routes';
import { AccountRoute } from './account.routes';

export const indexRouter = express.Router()

indexRouter.use('/api/v1/users', authRouter)

indexRouter.use('/api/v1/accounts', new AccountRoute().router)

export default indexRouter;