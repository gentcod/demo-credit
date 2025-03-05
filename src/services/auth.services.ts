import { AuthScripts } from "../scripts/auth.scripts";
import { db } from "../db";
import { IAuth } from "../models/Auth";
import { hasher } from "../utils/bcrypt";
import { CONFIG } from "../utils/config";
import { signJwt } from "../utils/jwt";
const scripts = new AuthScripts()


export class AuthServies {
   public async createUser(authDto: IAuth) {
      const email = authDto.email.toLowerCase();
      const auth = await db.get(scripts.getUserByEmail, [email]);      
      if (auth) {
         return {
            status: 400,
            message: 'User account already exists.'
         }
      }

      const hashedPassword = await hasher.hashPasswordHandler(authDto.password);

      await db.run(scripts.createUser, [
         email, hashedPassword, new Date().toISOString()
      ]);

      return {
         status: 200,
         message: 'User account has been created successfully. Proceed to login.',
      }
   }

   public async loginUser(authDto: IAuth) {
      const email = authDto.email.toLowerCase();
      const auth = await db.get(scripts.getUserByEmail, [email]);
      if (!auth) {
         return {
            status: 404,
            message: 'User account does not exist.'
         }
      }

      const isValid = await hasher.comparePassword(authDto.password, auth.password);
      if (!isValid) {
         return {
            status: 400,
            message: 'Wrong password.'
         }
      }

      const payload = {
         email: auth.email,
      };
      const token = signJwt(payload, CONFIG.JwtAuthExpiration);

      return {
         status: 200,
         message: 'User login successfully.',
         data: {
            token,
            payload
         }
      }
   }
}