import { DatabaseConnection } from "./internal/database";
import { initializeDatabase } from "./internal/migrate";
import { CONFIG } from "./utils/config";
import logger from "./utils/logger";

// =============================================
// Database connections and events
// =============================================
const database = new DatabaseConnection(CONFIG.DB);

// db connection events
database.on('connected', async () => {
  try {
    await initializeDatabase(database.getDatabase());
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