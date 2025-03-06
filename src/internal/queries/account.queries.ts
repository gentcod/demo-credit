import { Knex } from 'knex';
import { entities } from '../store';
import { IAccount } from '../models/Account';

const entity = entities.account;
type AccountUpdate = Pick<IAccount, 'balance'>;

export class AccountQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createAccount(account: IAccount, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(account).into<IAccount>(entity);
   }

   public async getAccount(accountId: string): Promise<any> {
      return this._db.select('*').from<IAccount>(entity).where('id', accountId)
   }

   public async getAccounts(userId: string, limit?: number, offset?: number): Promise<any> {
      return this._db.select('*').from<IAccount>(entity).where('user_id', userId).limit(limit).offset(offset);
   }

   public async getAccountForUpdate(accountId: string, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.select('*').from<IAccount>(entity).where('id', accountId).forUpdate();
   }

   public async updateAccount(data: AccountUpdate, userId: string, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.update(data).from<IAccount>(entity).where('user_id', userId);
   }
};