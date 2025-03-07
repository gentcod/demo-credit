import { Knex } from 'knex';
import { IProfile, Profile } from '../models/Profile';
import { Entities } from '../database';

// const entity = Entities.PROFILE;
type ProfileUpdate = Pick<IProfile, 'first_name' | 'last_name'>;

export class ProfileQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createProfile(profile: IProfile, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(profile).into<Profile>('profiles');
   }

   public async updateProfile(data: ProfileUpdate, user_id: string): Promise<any> {
      return this._db<Profile>('profiles').update({ ...data, updated_at: this._db.fn.now() }).where('user_id', user_id);
   }

   public async getProfile(user_id: string): Promise<Profile[]> {
      return this._db.select('*').from<Profile>('profiles').where('user_id', user_id);
   }
};