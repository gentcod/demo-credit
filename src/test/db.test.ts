import { Querier } from "../internal/store";
import { db } from "../db";
import { CONFIG } from "../utils/config";
import { WalletIDGenerator } from "../utils/account";
import { v4 as uuidv4 } from 'uuid';
import { randomEmail, randomMoney, randomStr } from "../utils/helper";
import { hasher } from "../utils/bcrypt";
import { randomInt } from "crypto";

const dbInstance = db.getDatabase();
const querier = new Querier(dbInstance);

type userProfile = {
   userId: string;
   email: string;
   password: string;
   first_name: string;
   last_name: string;
}

const createTestUser = async (): Promise<userProfile> => {
   const userProfile = {
      userId: uuidv4(),
      email: randomEmail(8), 
      password: randomStr(8),
      first_name: randomStr(8), 
      last_name: randomStr(8)
   }

   const hashedPassword = await hasher.hashPasswordHandler(userProfile.password);
   
   const res = await db.querier.userTx.createUser(
      { id: userProfile.userId,  email: userProfile.email, password: hashedPassword },
      { user_id: null, first_name: userProfile.first_name, last_name: userProfile.last_name }
   );

   return userProfile
}

describe('Database connection test', () => {
   test('test Database name fetch', async () => {   
      const result = await dbInstance.raw("SELECT DATABASE()");
      expect(Object.values(result[0][0])[0]).toBe(CONFIG.DB);
   });

   test('test User related entities', async () => {
      const userProfile = await createTestUser();

      const dbUser = await db.querier.user.getAuthById(userProfile.userId)
      const isValid = await hasher.comparePassword(userProfile.password, dbUser[0].password)
      
      // Test Auth entity
      expect(dbUser[0].id).toBe(userProfile.userId)
      expect(dbUser[0].email).toBe(userProfile.email)
      expect(dbUser[0].created_at).toBeDefined()
      expect(dbUser[0].updated_at).toBeDefined()
      expect(isValid).toBeTruthy()

      const dbProfile = await db.querier.profile.getProfile(userProfile.userId)

      // Test Profile entity
      expect(dbProfile[0].id).toBeDefined()
      expect(dbProfile[0].first_name).toBe(userProfile.first_name)
      expect(dbProfile[0].last_name).toBe(userProfile.last_name)
      expect(dbProfile[0].created_at).toBeDefined()
      expect(dbProfile[0].updated_at).toBeDefined()
   })

   test('test Account entity', async () => {
      const userProfile = await createTestUser();
      
      const data = {
         wallet_id: new WalletIDGenerator().generate(),
         currency: CONFIG.Currencies[randomInt(4)],
         user_id: userProfile.userId,
      }

      // Test Create Account 
      const acc = await querier.account.createAccount(data);      
      expect(acc).toBeDefined()

      const dbAccount = await querier.account.getAccount(userProfile.userId, data.currency);

      // Test Get Account by user_id
      expect(dbAccount[0].id).toBeDefined()
      expect(dbAccount[0].user_id).toBe(userProfile.userId)
      expect(dbAccount[0].balance).toBe(0)
      expect(dbAccount[0].currency).toBe(data.currency)
      expect(dbAccount[0].wallet_id).toBe(data.wallet_id)

      // Test Get Account by wallet_id
      const dbAccountByWallet = await querier.account.getAccountByWalletId(data.wallet_id);
      expect(dbAccountByWallet[0].id).toBeDefined()
      expect(dbAccountByWallet[0].user_id).toBe(userProfile.userId)
      expect(dbAccountByWallet[0].balance).toBe(0)
      expect(dbAccountByWallet[0].currency).toBe(data.currency)
      expect(dbAccountByWallet[0].wallet_id).toBe(data.wallet_id)

      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Test Fund Account
      const newBal = randomMoney()
      const fundRes = await querier.account.fundAccount(newBal, userProfile.userId, data.currency)
      expect(fundRes).toBeDefined()

      const dbAccountAfterUpdate = await querier.account.getAccountByWalletId(data.wallet_id);
      expect(dbAccountAfterUpdate[0].balance).toEqual(newBal)
      expect(new Date(dbAccount[0].updated_at).getTime()).toBeLessThan(new Date(dbAccountAfterUpdate[0].updated_at).getTime())
      expect(new Date(dbAccountByWallet[0].updated_at).getTime()).toBeLessThan(new Date(dbAccountAfterUpdate[0].updated_at).getTime())
   })

   test('test Transaction entities', async () => {
      const currency = CONFIG.Currencies[randomInt(4)];
      const amount = 200;
      const topup = randomMoney();

      const testUser1 = await createTestUser();
      const data1 = {
         wallet_id: new WalletIDGenerator().generate(),
         currency: currency,
         user_id: testUser1.userId,
      }

      const testUser2 = await createTestUser();
      const data2 = {
         wallet_id: new WalletIDGenerator().generate(),
         currency: currency,
         user_id: testUser2.userId,
      }

      const acc1 = await querier.account.createAccount(data1);      
      expect(acc1).toBeDefined();

      const fundRes = await querier.account.fundAccount(topup, testUser1.userId, data1.currency)
      expect(fundRes).toBeDefined()

      const acc2 = await querier.account.createAccount(data2);      
      expect(acc2).toBeDefined();

      const dbAccount1 = await querier.account.getAccount(testUser1.userId, currency);
      expect(dbAccount1).toBeDefined();

      const dbAccount2 = await querier.account.getAccount(testUser2.userId, currency);
      expect(dbAccount2).toBeDefined();

      // Create Transfer and Entry record
      await querier.transferTx.transfer({
         amount: amount,
         sender_id: dbAccount1[0].id,
         recipient_id: dbAccount2[0].id,
      }, currency);

      // Test Entry
      const entries1 = await querier.entry.getEntries(dbAccount1[0].id)
      expect(entries1[0].id).toBeDefined();
      expect(entries1[0].account_id).toBe(dbAccount1[0].id);
      expect(entries1[0].description).toContain(dbAccount2[0].id);
      expect(entries1[0].amount).toEqual((-amount).toFixed(2));
      expect(entries1[0].created_at).toBeDefined();

      const entries2 = await querier.entry.getEntries(dbAccount2[0].id)
      expect(entries2).toBeDefined();
      expect(entries2[0].account_id).toBe(dbAccount2[0].id);
      expect(entries2[0].description).toContain(dbAccount1[0].id);
      expect(entries2[0].amount).toEqual((amount).toFixed(2))
      expect(entries2[0].created_at).toBeDefined();

      const dbUpdatedAccount1 = await querier.account.getAccount(testUser1.userId, currency);
      expect(dbUpdatedAccount1[0].balance).toBeLessThan(dbAccount1[0].balance)

      const dbUpdatedAccount2 = await querier.account.getAccount(testUser2.userId, currency);
      expect(dbUpdatedAccount2[0].balance).toBeGreaterThan(dbAccount2[0].balance)

      const transfers = await querier.transfer.getTransfers(10);
      expect(transfers).toBeDefined();
   })
});

afterAll(async () => {
   await db.close();
});