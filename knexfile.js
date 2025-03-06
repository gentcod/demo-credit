import { CONFIG } from "./utils/config";

export default {
   client: 'mysql2',
   connection: {
      host: CONFIG.DBHost,
      port: parseInt(CONFIG.DBPort),
      user: CONFIG.DBUser,
      password: CONFIG.DBPassword,
      database: CONFIG.DB,
   },
   migrations: {
      directory: __dirname + "/src/internal/migrations",
      extension: "ts",
   },
};