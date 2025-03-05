import { Database } from 'sqlite3';
import logger from '../utils/logger';

/**
 * *initializeDatabase* is an helper function that helps to initialize database schemas.
 * It creates database tables relaing to schema definitions
 * @param database 
 * @returns 
 */
export const initializeDatabase = async (database: Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    database.exec(`
      -- Create auths table first since it will be referenced by sentiment_results
      CREATE TABLE IF NOT EXISTS auths (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      -- Create sentiment_results table with foreign key reference to auths
      CREATE TABLE IF NOT EXISTS sentiment_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        text TEXT NOT NULL,
        score REAL NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (user_email) REFERENCES auths(email)
          ON DELETE CASCADE 
          ON UPDATE CASCADE
      );

      -- Create indexes for better query performance
      CREATE INDEX IF NOT EXISTS idx_auth_email ON auths(email);
      CREATE INDEX IF NOT EXISTS idx_sentiment_user_email ON sentiment_results(user_email);
    `, (err) => {
      if (err) {
        database.emit('error', err);
        reject(err);
      } else {
        logger.info('Database migrations completed successfully');
        resolve();
      }
    });
  });
};