import { Knex } from 'knex';
import { Entities } from '../store';
import { IEntry } from '../models/Entry';

// const entity = Entities.ENTRY;

export class EntryQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createEntry(entry: IEntry, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(entry).into<IEntry>('entries');
   }

   public async getEntry(entryId: string): Promise<any> {
      return this._db.select('*').from<IEntry>('entries').where('id', entryId)
   }

   public async getEntries(
      accountId: string, limit?: number, offset?: number
   ): Promise<any> {
      return this._db.select('*').from<IEntry>('entries').where('user_id', accountId).limit(limit).offset(offset);
   }
};