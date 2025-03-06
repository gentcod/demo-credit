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
   account1Id: string,
   amount1: number,
   account2Id: string,
   amount2: number
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

   public async transfer(params: TransferTxParams) {
      try {
         await execTx(this._db, async (trx) => {
            await this._transfer.createTransfer(params.transfer, trx);

            await this._entries.createEntry(
               {
                  account_id: params.transfer.sender_id,
                  amount: -params.transfer.amount,
               },
               trx
            )

            await this._entries.createEntry(
               {
                  account_id: params.transfer.recipient_id,
                  amount: params.transfer.amount,
               },
               trx
            )

            // update accounts
            await this._addMoney(
               {
                  account1Id: params.transfer.sender_id,
                  amount1: -params.transfer.amount,
                  account2Id: params.transfer.recipient_id,
                  amount2: params.transfer.amount
               },
               trx
            )
         })
      } catch (err) {
         throw err;
      }
   }

   private async _addMoney(param: AccountTXParam, trx: Knex.Transaction): Promise<AccountTXResult> {
      try {
         const senderRes = await this._account.getAccountForUpdate(param.account1Id, trx);
         await this._account.updateAccount(
            {
               balance: senderRes[0].balance - param.amount1,
            },
            senderRes[0].id,
            trx
         )
         const account1 = await this._account.getAccount(param.account1Id);

         const recipientRes = await this._account.getAccountForUpdate(param.account1Id, trx);
         await this._account.updateAccount(
            {
               balance: recipientRes[0].balance + param.amount1,
            },
            recipientRes[0].id,
            trx
         )
         const account2 = await this._account.getAccountForUpdate(param.account2Id);
         return { account1: account1[0], account2: account2 }
      } catch (error) {
         throw error;
      }
   }
}