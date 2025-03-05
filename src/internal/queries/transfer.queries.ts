import { Knex } from 'knex';

export class TransferQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createTransfer() {
      // ...
   }

   public async getTransfer() {
      // ...
   }

   public async getTransfers() {
      // ...
   }
};