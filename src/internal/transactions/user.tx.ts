import { Knex } from 'knex';
import { execTx } from '../database';
import { AuthQueries } from '../queries/auth.queries';
import { ProfileQueries } from '../queries/profile.queries';
import { IProfile } from '../models/Profile';
import { IAuth } from '../models/Auth';

export class UserTx {
   private _db: Knex
   private _auth: AuthQueries
   private _profile: ProfileQueries

   constructor(db: Knex, auth: AuthQueries, profile: ProfileQueries) {
      this._db = db;
      this._auth = auth;
      this._profile = profile
   }

   public async createUser(auth: IAuth, profile: IProfile) {
      try {
         await execTx(this._db, async (trx) => {
            await this._auth.createAuth(auth, trx);
            const authRes = await this._auth.getAuthId();
            profile.user_id = authRes[0].id;
            await this._profile.createProfile(profile, trx);
         });
      } catch (err) {
         throw err;
      }
   }
}