import { Knex } from 'knex';
import { ITransfer } from '../models/Transfer';
import { entities } from '../store';

const entity = entities.transfer;

export class TransferQueries {
   private _db: Knex

   constructor(db: Knex) {
      this._db = db;
   }
   public async createTransfer(transfer: ITransfer, trx?: Knex.Transaction): Promise<any> {
      const db = trx || this._db;
      return db.insert(transfer).into<ITransfer>(entity);
   }

   public async getTransfer(transferId: string): Promise<any> {
      return this._db.select('*').from<ITransfer>(entity).where('id', transferId)
   }

   public async getTransfers(limit?: number, offset?: number): Promise<any> {
      return this._db.select('*').from<ITransfer>(entity).limit(limit).offset(offset);
   }
};