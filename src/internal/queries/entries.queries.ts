import { Knex } from 'knex';
import { entities } from '../store';
import { IEntry } from '../models/Entry';

const entity = entities.entry;

export class EntryQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createEntry(entry: IEntry, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(entry).into<IEntry>(entity);
   }

   public async getEntry(entryId: string): Promise<any> {
      return this._db.select('*').from<IEntry>(entity).where('id', entryId)
   }

   public async getEntries(
      accountId: string, limit?: number, offset?: number
   ): Promise<any> {
      return this._db.select('*').from<IEntry>(entity).where('user_id', accountId).limit(limit).offset(offset);
   }
};