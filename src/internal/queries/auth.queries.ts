import { Knex } from 'knex';
import { IAuth } from '../models/Auth';
import { Entities } from '../database';

// const entity = Entities.AUTH;
type AuthUpdate = Pick<IAuth, 'email' | 'password'>;

export class AuthQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createAuth(auth: IAuth, trx: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(auth).into<IAuth>('auths');
   }

   public async updateAuth(data: AuthUpdate, user_id: string): Promise<any> {
      return this._db('auths').update({ ...data, updated_at: this._db.fn.now() }).where('id', user_id);
   }

   public async getAuthByEmail(email: string): Promise<any> {
      return this._db.select('id', 'email').from<IAuth>('auths').where('email', email);
   }

   public async getAuthById(user_id: string): Promise<any> {
      return this._db.select('*').from<IAuth>('auths').where('id', user_id);
   }
};