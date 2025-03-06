import { Knex } from 'knex';
import { Entities } from '../store';
import { IAccount } from '../models/Account';

// const entity = entities.ACCOUNT;

// console.log(entity);

type AccountUpdate = Pick<IAccount, 'balance'>;

export class AccountQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createAccount(account: IAccount, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(account).into<IAccount>('accounts');
   }

   public async getAccount(accountId: string): Promise<any> {
      return this._db.select('*').from<IAccount>('accounts').where('id', accountId)
   }

   public async getAccounts(userId: string, limit?: number, offset?: number): Promise<any> {
      return this._db.select('*').from<IAccount>('accounts').where('user_id', userId).limit(limit).offset(offset);
   }

   public async getAccountForUpdate(accountId: string, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.select('*').from<IAccount>('accounts').where('id', accountId).forUpdate();
   }

   public async updateAccount(data: AccountUpdate, userId: string, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.update(data).from<IAccount>('accounts').where('user_id', userId);
   }
};