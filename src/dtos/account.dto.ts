import { Account } from "../internal/models/Account";

export interface AccountDto {
   email: string;
   currency: string;
}

export interface FundDto {
   user_id: string;
   amount: number;
   currency: string;
}

export class AccountResponse {
   user_id?: string;
   currency: string;
   balance: number;
   wallet_id: string;
   created_at: Date;
   updated_at: Date;

   static createResponse(account: Account): AccountResponse {
      return {
         user_id: account.user_id!,
         currency: account.currency,
         balance: account.balance,
         wallet_id: account.wallet_id,
         created_at: account.created_at,
         updated_at: account.updated_at,
      }
   }

   static createMultipleResponse(account: Account): AccountResponse {
      return {
         currency: account.currency,
         balance: account.balance,
         wallet_id: account.wallet_id,
         created_at: account.created_at,
         updated_at: account.updated_at,
      }
   }
}