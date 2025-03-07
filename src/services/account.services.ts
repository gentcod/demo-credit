import { db } from "../db";
import { AccountDto, AccountResponse, FundDto } from "../dtos/account.dto";
import { WalletIDGenerator } from "../utils/account";
import { ApiResponse } from "../utils/apiResponse";

export class AccountServies {
   public async createAccount(accountDto: AccountDto): Promise<ApiResponse<any>> {
      const auth = await db.querier.user.getAuthByEmail(accountDto.email);
      if (!auth[0]) {
         return {
            status: 403,
            message: 'Account cannot be created by unauthorized user.'
         }
      }

      const existingAccount = await db.querier.account.getAccount(auth[0].id, accountDto.currency);
      if (existingAccount[0]) {
         return {
            status: 400,
            message: 'Account already exists.'
         }
      }

      const wallet_id = new WalletIDGenerator().generate();
      await db.querier.account.createAccount(
         {
            wallet_id,
            user_id: auth[0].id,
            currency: accountDto.currency,
         }
      )

      const account = await db.querier.account.getAccount(auth[0].id, accountDto.currency);

      const resp = AccountResponse.createResponse(account[0])
      
      return {
         status: 200,
         message: 'Account has been created successfully.',
         data: {
            account: resp,
         }
      }
   }

   public async updateBalance(fund: FundDto, withdrawal?: boolean): Promise<ApiResponse<any>> {
      const auth = await db.querier.user.getAuthById(fund.user_id);
      if (!auth[0]) {
         return {
            status: 403,
            message: 'Account cannot be created by unauthorized user.'
         }
      }

      const existingAccount = await db.querier.account.getAccount(auth[0].id, fund.currency);
      if (!existingAccount[0]) {
         return {
            status: 400,
            message: `You do not have a ${fund.currency} based account. Verify currency or create new account.`
         }
      }

      const newBal = withdrawal ? existingAccount[0].balance - fund.amount : existingAccount[0].balance + fund.amount

      await db.querier.account.fundAccount(
         newBal,
         auth[0].id,
         fund.currency
      )

      const account = await db.querier.account.getAccount(auth[0].id, fund.currency);

      const resp = AccountResponse.createResponse(account[0])
      
      return {
         status: 200,
         message: 'Acount has been funded successfully.',
         data: {
            account: resp,
         }
      }
   }

   public async getAccounts(user_id: string): Promise<ApiResponse<any>> {
      const auth = await db.querier.user.getAuthById(user_id);
      if (!auth[0]) {
         return {
            status: 403,
            message: 'Accounts cannot be fetched by unauthorized user.'
         }
      }

      const existingAccount = await db.querier.account.getAccounts(auth[0].id);

      const resp = existingAccount.map(acc => AccountResponse.createMultipleResponse(acc))
      
      return {
         status: 200,
         message: 'Accounts have been fetched successfully.',
         data: {
            account: resp,
         }
      }
   }

   public async getAccount(user_id: string, currency: string): Promise<ApiResponse<any>> {
      const auth = await db.querier.user.getAuthById(user_id);
      if (!auth[0]) {
         return {
            status: 403,
            message: 'Account cannot be fetched by unauthorized user.'
         }
      }

      const account = await db.querier.account.getAccount(auth[0].id, currency);
      if (!account[0]) {
         return {
            status: 404,
            message: `Account with ${currency} currency does not exist.`
         }
      }

      const resp = AccountResponse.createResponse(account[0])
      
      return {
         status: 200,
         message: 'Account has been fetched successfully.',
         data: {
            account: resp,
         }
      }
   }
}
