import express from 'express';
import { AccountRoute } from './account/account.routes';
import { TransferRoute } from './transfer/transfer.routes';
import { UserRoute } from './user/auth.routes';

export const indexRouter = express.Router()

indexRouter.use('/api/v1/users', new UserRoute().router)

indexRouter.use('/api/v1/accounts', new AccountRoute().router)

indexRouter.use('/api/v1/transfers', new TransferRoute().router)

export default indexRouter;