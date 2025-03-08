import { Querier } from "../internal/store";
import { db } from "../db";
import { CONFIG } from "../utils/config";
import { WalletIDGenerator } from "../utils/account";
import { v4 as uuidv4 } from 'uuid';
import { randomEmail, randomStr } from "../utils/helper";
import { hasher } from "../utils/bcrypt";

const dbInstance = db.getDatabase();
const querier = new Querier(dbInstance);

type userProfile = {
   userId: string;
   email: string;
   password: string;
   first_name: string;
   last_name: string;
}

const createUer = async (): Promise<userProfile> => {
   const userProfile = {
      userId: uuidv4(),
      email: randomEmail(8), 
      password: randomStr(8),
      first_name: randomStr(8), 
      last_name: randomStr(8)
   }

   const hashedPassword = await hasher.hashPasswordHandler(userProfile.password);
   
   await db.querier.userTx.createUser(
      { id: userProfile.userId,  email: userProfile.email, password: hashedPassword },
      { user_id: null, first_name: userProfile.first_name, last_name: userProfile.last_name }
   );

   return userProfile
}

describe('Database connection test', () => {
   test('should return the database name', async () => {   
      const result = await dbInstance.raw("SELECT DATABASE()");
      expect(Object.values(result[0][0])[0]).toBe(CONFIG.DB);
   });

   test('test User related entities', async () => {
      const userProfile = await createUer();

      const dbUser = await db.querier.user.getAuthById(userProfile.userId)
      const dbProfile = await db.querier.profile.getProfile(userProfile.userId)
      const isValid = await hasher.comparePassword(userProfile.password, dbUser[0].password)

      // Test Auth entity
      expect(dbUser[0].id).toBe(userProfile.userId)
      expect(dbUser[0].email).toBe(userProfile.email)
      expect(dbUser[0].created_at).toBeDefined()
      expect(dbUser[0].updated_at).toBeDefined()
      expect(isValid).toBeTruthy()

      // Test Profile entity
      expect(dbProfile[0].id).toBeDefined()
      expect(dbProfile[0].first_name).toBe(userProfile.first_name)
      expect(dbProfile[0].last_name).toBe(userProfile.last_name)
      expect(dbProfile[0].created_at).toBeDefined()
      expect(dbProfile[0].updated_at).toBeDefined()
   })

   test('test account entity', async () => {
      const userProfile = await createUer();
      
      const data = {
         wallet_id: new WalletIDGenerator().generate(),
         currency: CONFIG.Currencies[0],
         user_id: userProfile.userId,
      }

      const acc = await querier.account.createAccount(data);      
      const dbAccount = await querier.account.getAccount(userProfile.userId, data.currency);

      // Test Create Account and Get Account
      expect(acc).toBeDefined()
      expect(dbAccount[0].id).toBeDefined()
      expect(dbAccount[0].user_id).toBe(userProfile.userId)
      expect(dbAccount[0].balance).toBe(0)
      expect(dbAccount[0].currency).toBe(data.currency)
      expect(dbAccount[0].wallet_id).toBe(data.wallet_id)
   })
});

afterAll(async () => {
   await db.close();
});