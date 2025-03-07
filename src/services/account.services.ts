import { AccountDto, FundDto } from "../dtos/account.dto";
import { db } from "../db";
import { ApiResponse } from "../utils/apiResponse";
import { AccountNumberGenerator } from "../utils/account";
import knex from "knex/types";

export class AccountServies {
   public async createAccount(accountDto: AccountDto): Promise<ApiResponse<any>> {
      const auth = await db.querier.user.getAuthByEmail(accountDto.email);
      if (!auth[0]) {
         return {
            status: 404,
            message: 'Account cannot be created by unauthorized user.'
         }
      }

      const existingAccount = await db.querier.account.getAccount(auth[0].id, accountDto.currency);
      if (existingAccount[0]) {
         return {
            status: 404,
            message: 'Account already exists.'
         }
      }

      const account_no = new AccountNumberGenerator().generate();
      await db.querier.account.createAccount(
         {
            account_no,
            user_id: auth[0].id,
            currency: accountDto.currency,
         }
      )

      const account = await db.querier.account.getAccount(auth[0].id, accountDto.currency);
      
      return {
         status: 200,
         message: 'Account has been created successfully.',
         data: {
            account: account[0],
         }
      }
   }

   public async fundAccount(fund: FundDto): Promise<ApiResponse<any>> {
      const auth = await db.querier.user.getAuthById(fund.user_id);
      if (!auth[0]) {
         return {
            status: 404,
            message: 'Account cannot be created by unauthorized user.'
         }
      }

      const existingAccount = await db.querier.account.getAccount(auth[0].id, fund.currency);
      if (!existingAccount[0]) {
         return {
            status: 404,
            message: `Account is not ${fund.currency} based account or account does not exist.
               Verify currency and/or account number.
            `
         }
      }

      await db.querier.account.fundAccount(
         existingAccount[0].balance + fund.amount,
         auth[0].id,
         fund.currency
      )

      const account = await db.querier.account.getAccount(auth[0].id, fund.currency);
      
      return {
         status: 200,
         message: 'Acount has been funded successfully.',
         data: {
            account: account[0],
         }
      }
   }
}