import sqlite3 from 'sqlite3';
import { EventEmitter } from 'events';
import logger from '../utils/logger';

export class DatabaseConnection extends EventEmitter {
   private db: sqlite3.Database;
   private isConnected: boolean = false;

   constructor(dbstring: string) {
      super();
      this.connect(dbstring);
   }

   /**
    * *connect* is used to establish connection to a SQLite database if the database exists
    * and creates one based on the doptional atabase string, if it doesn't exist.
    * To persist data, replace *':memory:'* with the *dbstring* parameter
    * @param dbstring?
    */
   private connect(dbstring?: string): void {
      try {
         this.db = new sqlite3.Database(dbstring, (err) => {
            if (err) {
               logger.error('Database connection error:', err);
               this.emit('error', err);
            } else {
               this.isConnected = true;
               this.emit('connected');
            }
         });

         this.db.configure('busyTimeout', 3000);
      } catch (error) {
         this.emit('error', error);
      }
   }

   /**
    * *getDatabase* simply returns the database object.
    * @returns 
    */
   public getDatabase(): sqlite3.Database {
      return this.db;
   }

   /**
    * *close* is used to close a database connection.
    * @returns 
    */
   public async close(): Promise<void> {
      return new Promise((resolve, reject) => {
         if (!this.isConnected) {
            resolve();
            return;
         }

         this.db.close((err) => {
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

   /**
    * *run* is an helper method to run queries with promises.
    * @param sql 
    * @param params 
    * @returns 
    */
   public async run(sql: string, params: any[] = []): Promise<any> {
      return new Promise((resolve, reject) => {
         this.db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
         });
      });
   }

   /**
    * // *get* i an helper method to get a single row in the database.
    * @param sql 
    * @param params 
    * @returns 
    */
   public async get(sql: string, params: any[] = []): Promise<any> {
      return new Promise((resolve, reject) => {
         this.db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
         });
      });
   }

   /**
    * *getAll* is an helper method to get multiple rows in the database.
    * @param sql 
    * @param params 
    * @returns 
    */
   public async getMultipe(sql: string, params: any[] = []): Promise<any[]> {
      return new Promise((resolve, reject) => {
         this.db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
         });
      });
   }
}