import { Knex } from 'knex';
import { EventEmitter } from 'events';
import logger from '../utils/logger';

type DBConfig = {
   client: string;
   dbstring: string;
   host: string;
   port: number;
   user: string;
   password: string;
}

export class DatabaseConnection extends EventEmitter {
   private db: Knex;
   private isConnected: boolean = false;

   constructor(dbConfig: DBConfig) {
      super();
      this.connect(dbConfig);
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
               directory: __dirname + "/migrations",
               extension: "ts",
            },
            debug: process.env.NODE_ENV === 'development' ? true : false,
         });
         this.db = knex;
         this.isConnected = true;
         await this.db.initialize();
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
      return this.db;
   }

   /**
    * *migrate* is used to run the latest migration on the database.
    * @returns Promise<void>
    */
   public async migrate(): Promise<void> {
      try {
         logger.info('Starting database migration...');
         const [batchNo, log] = await this.db.migrate.latest();
         logger.info(`Batch ${batchNo} completed`);
         logger.info('Migrations run:', log);
      } catch (error) {
         logger.error('Migration failed:', error);
         this.emit('error', error);
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

         this.db.destroy((err: Error | undefined) => {
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