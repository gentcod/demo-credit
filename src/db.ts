import { DatabaseConnection } from "./internal/database";
import { CONFIG } from "./utils/config";
import logger from "./utils/logger";

// =============================================
// Database connections and events
// =============================================
const database = new DatabaseConnection({
  client: 'mysql2',
  dbstring: CONFIG.DB,
  host: CONFIG.DBHost,
  port: parseInt(CONFIG.DBPort),
  user: CONFIG.DBUser,
  password: CONFIG.DBPassword
});

// db connection events
database.on('connected', async () => {
  try {
    logger.info('Database connection has been established successfully');
  } catch (e) {
    logger.debug('Failed to initialize database  ' + e);
  }
});

database.on("error", error => {
  logger.debug('Database connection error: ' + error);
});

database.on("disconnected", () => {
  logger.debug('Databse has been disconnected');
});

/**
 * gracefulExit helps to ensure database is closed when app process is terminated.
 */
const gracefulExit = async () => {
  await database.close();
  logger.info('Database connection disconnected by app termination');
  process.exit(0);
}

// =======================================================
// If the Node process ends, close the Database connection
// =======================================================

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit)
export const db = database;