import { Knex } from 'knex';

export class AccountQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createAccount() {
      // ...
   }

   public async getAccount() {
      // ...
   }

   public async getAccounts() {
      // ...
   }

   public async getAccountForUpdate() {
      // ...
   }

   public async updateAccount() {
      // ...
   }
};