import { Knex } from 'knex';
import { EventEmitter } from 'events';
import logger from '../utils/logger';
import { Querier } from './store';

type DBConfig = {
   client: string;
   dbstring: string;
   host: string;
   port: number;
   user: string;
   password: string;
}

/**
 * @author: Oyefule Oluwatayo @gentcod
 * *DatabaseConnection* is a class that handles database connections.
 * It is used to establish a connection to the database.
 */
export class DatabaseConnection extends EventEmitter {
   private _db: Knex;
   private isConnected: boolean = false;
   public querier: Querier;

   constructor(dbConfig: DBConfig) {
      super();
      this.connect(dbConfig);
      this.querier = new Querier(this._db);
   }

   /**
    * *connect* is used to establish a connection to the database. 
    * It entails logic to handle connection errors and success.
    * It also used to declare migration setups.
    * @param dbConfig
    * @returns Promise<void>
    */
   private async connect(dbConfig: DBConfig): Promise<void> {
      try {
         const knex = require('knex')({
            client: dbConfig.client,
            connection: {
               host: dbConfig.host,
               port: dbConfig.port,
               user: dbConfig.user,
               password: dbConfig.password,
               database: dbConfig.dbstring,
            },
            migrations: {
               directory: "./src/internal/migrations",
            },
            // debug: process.env.NODE_ENV === 'development' ? true : false, // Uncomment to enable debug
         });
         this._db = knex;
         this.isConnected = true;
         await this._db.initialize();
         this.emit('connected');
      } catch (error) {
         this.emit('error', error);
      }
   }

   /**
    * *getDatabase* simply returns the database object.
    * @returns Knex
    */
   public getDatabase(): Knex {
      return this._db;
   }

   /**
    * *migrate* is used to run the latest migration on the database.
    * @returns Promise<void>
    */
   public async migrate(): Promise<void> {
      try {
         logger.info('Starting database migration...');
         const [batchNo, log] = await this._db.migrate.latest();
         logger.info(`Batch ${batchNo} completed`);
         logger.info('Migrations run:', log);
      } catch (error) {
         logger.error('Migration failed:', error);
      }
   }

   /**
    * *close* is used to close a database connection.
    * @returns Promise<void>
    */
   public async close(): Promise<void> {
      return new Promise((resolve, reject) => {
         if (!this.isConnected) {
            resolve();
            return;
         }

         this._db.destroy((err: Error | undefined) => {
            if (err) {
               this.emit('error', err);
               reject(err);
            } else {
               this.isConnected = false;
               this.emit('disconnected');
               logger.info('Database connection closed');
               resolve();
            }
         });
      });
   }
}

/**
 * @author: Oyefule Oluwatayo @gentcod
 * *execTx* is a utility function that handles database transactions. 
 * It commits the transaction if successful.
 * It is used to handle transaction errors and rollback the transaction if an error occurs.
 * @param db: Knex - database instance
 * @param fn: (trx: Knex.Transaction) => Promise<void> - function to execute transaction
 * @returns Promise<void>
 */
export const execTx = async (db: Knex, fn: (trx: Knex.Transaction) => Promise<void>): Promise<void> => {
   const trx = await db.transaction();
   try {
     await fn(trx);
     await trx.commit();
   } catch (err) {
     await trx.rollback();
     throw new Error(`Transaction failed: ${err}`);
   }
}