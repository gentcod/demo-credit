import { Knex } from 'knex';

export class EntryQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createEntry() {
      // ...
   }

   public async getEntry() {
      // ...
   }

   public async getEntries() {
      // ...
   }
};