import { Knex } from 'knex';
import { getTimestampFromUUID } from '../../utils/transaction';
import { execTx } from '../database';
import { Account } from '../models/Account';
import { ITransfer } from '../models/Transfer';
import { AccountQueries } from '../queries/account.queries';
import { EntryQueries } from '../queries/entries.queries';
import { TransferQueries } from '../queries/transfer.queries';

type AccountTXParam = {
   account1Id: string;
   amount1: number;
   account2Id: string;
   amount2: number;
   currency: string;
}

export class TransferTx {
   private _db: Knex
   private _transfer: TransferQueries
   private _account: AccountQueries
   private _entries: EntryQueries

   constructor(
      db: Knex,
      transfer: TransferQueries,
      account: AccountQueries,
      entries: EntryQueries
   ) {
      this._db = db;
      this._transfer = transfer;
      this._account = account;
      this._entries = entries;
   }

   public async transfer(transfer: ITransfer, currency: string): Promise<Account> {
      try {
         let result;
         await execTx(this._db, async (trx) => {            
            await this._transfer.createTransfer(transfer, trx);

            const senderUnixTime = getTimestampFromUUID(transfer.sender_id);
            const recipientUnixTime = getTimestampFromUUID(transfer.recipient_id);

            if (senderUnixTime < recipientUnixTime ){
               result = await this._updateAccounts(
                  {
                     account1Id: transfer.sender_id,
                     amount1: -transfer.amount,
                     account2Id: transfer.recipient_id,
                     amount2: transfer.amount,
                     currency,
                  },
                  trx
               )
            } else {
               result = await this._updateAccounts(
                  {
                     account1Id: transfer.recipient_id,
                     amount1: transfer.amount,
                     account2Id: transfer.sender_id,
                     amount2: -transfer.amount,
                     currency,
                  },
                  trx
               )
            }

            await this._entries.createEntry(
               {
                  account_id: transfer.sender_id,
                  amount: -transfer.amount,
                  description: `debit-${transfer.recipient_id}`
               },
               trx
            )

            await this._entries.createEntry(
               {
                  account_id: transfer.recipient_id,
                  amount: transfer.amount,
                  description: `credit-${transfer.sender_id}`
               },
               trx
            )

         })
         return result;
      } catch (err) {
         throw err;
      }
   }

   private async _updateAccounts(param: AccountTXParam, trx: Knex.Transaction): Promise<void> {
      try {         
         const account1 = await this._account.getAccountForUpdate(param.account1Id, trx);
         await this._account.fundAccount(
            (account1[0].balance + param.amount1),
            account1[0].user_id,
            param.currency,
            trx
         )

         const account2 = await this._account.getAccountForUpdate(param.account2Id, trx);         
         await this._account.fundAccount(
            account2[0].balance + param.amount2,
            account2[0].user_id,
            param.currency,
            trx
         )
      } catch (error) {
         throw error;
      }
   }
}