import { Knex } from 'knex';
import { execTx } from '../database';
import { IAccount } from '../models/Account';
import { ITransfer } from '../models/Transfer';
import { AccountQueries } from '../queries/account.queries';
import { EntryQueries } from '../queries/entries.queries';
import { TransferQueries } from '../queries/transfer.queries';

type TransferTxParams = {
   transfer: ITransfer;
}

type AccountTXParam = {
   account1Id: string;
   amount1: number;
   account2Id: string;
   amount2: number;
   currency: string;
}

type AccountTXResult = {
   account1: IAccount;
   account2: IAccount;
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

   public async transfer(transfer: ITransfer, currency: string): Promise<any> {
      try {
         let result;
         await execTx(this._db, async (trx) => {
            await this._transfer.createTransfer(transfer, trx);

            await this._entries.createEntry(
               {
                  account_id: transfer.sender_id,
                  amount: -transfer.amount,
               },
               trx
            )

            await this._entries.createEntry(
               {
                  account_id: transfer.recipient_id,
                  amount: transfer.amount,
               },
               trx
            )

            // update accounts
            result = await this._addMoney(
               {
                  account1Id: transfer.sender_id,
                  amount1: -transfer.amount,
                  account2Id: transfer.recipient_id,
                  amount2: transfer.amount,
                  currency,
               },
               trx
            )
         })
         return result;
      } catch (err) {
         throw err;
      }
   }

   private async _addMoney(param: AccountTXParam, trx: Knex.Transaction): Promise<void> {
      try {
         const senderRes = await this._account.getAccountForUpdate(param.account1Id, trx);
         await this._account.fundAccount(
            senderRes[0].balance - param.amount1,
            senderRes[0].id,
            param.currency,
            trx
         )

         const recipientRes = await this._account.getAccountForUpdate(param.account1Id, trx);
         await this._account.fundAccount(
            recipientRes[0].balance + param.amount1,
            recipientRes[0].id,
            param.currency,
            trx
         )
      } catch (error) {
         throw error;
      }
   }
}