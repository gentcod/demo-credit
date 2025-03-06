import { DatabaseConnection } from "../internal/database";
import { CONFIG } from "../utils/config";

describe('Database connection test', () => {
   test('should return the database name', async () => {   
      const database = new DatabaseConnection({
         client: 'mysql2',
         dbstring: CONFIG.DB,
         host: CONFIG.DBHost,
         port: parseInt(CONFIG.DBPort),
         user: CONFIG.DBUser,
         password: CONFIG.DBPassword
      });
      const db = database.getDatabase();
      const result = await db.raw("SELECT DATABASE()");
      console.log(result[0]);
      
      expect(Object.values(result[0][0])[0]).toBe(CONFIG.DB);
      await database.close();
   });
});