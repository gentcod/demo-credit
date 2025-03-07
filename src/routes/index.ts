import express from 'express';
import authRouter from './auth.routes';
import { AccountRoute } from './account.routes';
import { TransferRoute } from './transfer.routes';

export const indexRouter = express.Router()

indexRouter.use('/api/v1/users', authRouter)

indexRouter.use('/api/v1/accounts', new AccountRoute().router)

indexRouter.use('/api/v1/transfers', new TransferRoute().router)

export default indexRouter;