import { Knex } from 'knex';
import { AccountQueries } from '../queries/account.queries';
import { EntryQueries } from '../queries/entries.queries';
import { execTx } from '../database';

export class AccountTx {
   private _db: Knex;
   private _account: AccountQueries;
   private _entries: EntryQueries;

   constructor(
      db: Knex,
      account: AccountQueries,
      entries: EntryQueries
   ) {
      this._db = db;
      this._account = account;
      this._entries = entries;
   }

   public async updateBalance(
      accountId: string, 
      updateType: 'topup' | 'withdrawal', 
      amount: number,
      currency: string
   ) {
      try {
         await execTx(this._db, async (trx) => {
            const account = await this._account.getAccountForUpdate(accountId, trx);
            await this._account.fundAccount(
               (account[0].balance + amount),
               account[0].user_id,
               currency,
               trx
            )

            await this._entries.createEntry(
               {
                  account_id: accountId,
                  amount,
                  description: updateType,
               },
               trx
            )
         });
      } catch (err) {
         throw err;
      }
   }
}