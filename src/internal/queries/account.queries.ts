import { Knex } from 'knex';
import { Entities } from '../database';
import { IAccount } from '../models/Account';

// const entity = entities.ACCOUNT;

// console.log(entity);

type AccountCreate = Pick<IAccount, 'account_no' & 'currency' & 'user_id'>;

export class AccountQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createAccount(data: AccountCreate, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(data).into<IAccount>('accounts').returning('*');
   }

   public async getAccount(userId: string, currency: string): Promise<any> {
      return this._db.select('*').from<IAccount>('accounts').where('user_id', userId).andWhere('currency', currency)
   }

   public async getAccountByAccNo(account_no: string, currency: string): Promise<any> {
      return this._db.select('*').from<IAccount>('accounts').where('account_no', account_no).andWhere('currency', currency)
   }

   public async getAccounts(userId: string, limit?: number, offset?: number): Promise<any> {
      return this._db.select('*').from<IAccount>('accounts').where('user_id', userId).limit(limit).offset(offset);
   }

   public async getAccountForUpdate(accountId: string, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.select('*').from<IAccount>('accounts').where('id', accountId).forUpdate();
   }

   public async fundAccount(balance: number, userId: string, currency: string, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db('accounts').update({
         balance: balance,
         updated_at: this._db.fn.now(),
      }).where('user_id', userId).andWhere('currency', currency);
   }
};