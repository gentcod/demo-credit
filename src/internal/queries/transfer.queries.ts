import { Knex } from 'knex';
import { ITransfer, Transfer } from '../models/Transfer';
import { Entities } from '../database';

// const entity = Entities.TRANSFER;

export class TransferQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createTransfer(transfer: ITransfer, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(transfer).into<Transfer>('transfers');
   }

   public async getTransfer(transferId: string): Promise<Transfer[]> {
      return this._db.select('*').from<Transfer>('transfers').where('id', transferId)
   }

   public async getTransfers(limit: number = 10, offset?: number): Promise<Transfer[]> {
      return this._db.select('*').from<Transfer>('transfers').limit(limit).offset(offset);
   }
};