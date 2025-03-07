import { db } from "../db";
import { CONFIG } from "../utils/config";

const dbInstance = db.getDatabase();

describe('Database connection test', () => {
   test('should return the database name', async () => {   
      const result = await dbInstance.raw("SELECT DATABASE()");
      console.log(result[0]);
      expect(Object.values(result[0][0])[0]).toBe(CONFIG.DB);
   });
});

afterAll(async () => {
   await db.close();
});