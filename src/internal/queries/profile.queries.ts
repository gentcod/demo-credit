import { Knex } from 'knex';
import { IProfile } from '../models/Profile';

type ProfileUpdate = Pick<IProfile, 'first_name' | 'last_name'>;

export class ProfileQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createProfile(profile: IProfile, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(profile).into<IProfile>('profiles');
   }

   public async updateProfile(data: ProfileUpdate, user_id: string): Promise<any> {
      return this._db.update(data).from<IProfile>('profiles').where('user_id', user_id);
   }

   public async getProfile(user_id: string): Promise<any> {
      return this._db.select('*').from<IProfile>('profiles').where('user_id', user_id);
   }
};