import { Knex } from 'knex';
import { Entities } from '../database';
import { Entry, IEntry } from '../models/Entry';

// const entity = Entities.ENTRY;

export class EntryQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createEntry(entry: IEntry, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(entry).into<Entry>('entries');
   }

   public async getEntry(entryId: string): Promise<Entry[]> {
      return this._db.select('*').from<Entry>('entries').where('id', entryId)
   }

   public async getEntries(
      accountId: string, limit: number = 10, offset?: number
   ): Promise<Entry[]> {
      return this._db.select('*').from<Entry>('entries').where('account_id', accountId).limit(limit!).offset(offset!);
   }
};