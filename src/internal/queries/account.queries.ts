import { Knex } from 'knex';
import { Entities } from '../database';
import { Account, IAccount } from '../models/Account';

// const entity = entities.ACCOUNT;

// console.log(entity);

type AccountCreate = Pick<IAccount, 'wallet_id' & 'currency' & 'user_id'>;

export class AccountQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createAccount(data: AccountCreate, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(data).into<Account>('accounts').returning('*');
   }

   public async getAccount(userId: string, currency: string): Promise<Account[]> {
      return this._db.select('*').from<Account>('accounts').where('user_id', userId).andWhere('currency', currency)
   }

   public async getAccountByWalletId(wallet_id: string): Promise<Account[]> {
      return this._db.select('*').from<Account>('accounts').where('wallet_id', wallet_id)
   }

   public async getAccounts(userId: string, limit?: number, offset?: number): Promise<Account[]> {
      return this._db.select('*').from<Account>('accounts').where('user_id', userId).limit(limit).offset(offset);
   }

   public async getAccountForUpdate(accountId: string, trx: Knex.Transaction): Promise<any> {
      return trx<Account>('accounts').select('*').where('id', accountId).forUpdate();
   }

   public async fundAccount(balance: number, userId: string, currency: string, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db<Account>('accounts').update({
         balance: balance,
         updated_at: this._db.fn.now(),
      }).where('user_id', userId).andWhere('currency', currency);
   }
};