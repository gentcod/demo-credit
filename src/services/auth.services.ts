import { db } from "../db";
import { IAuth } from "../models/Auth";
import { hasher } from "../utils/bcrypt";
import { CONFIG } from "../utils/config";
import { signJwt } from "../utils/jwt";
import { UserDto } from "../dtos/user.dto";

export class AuthServies {
   public async createUser(userDto: UserDto) {
      const {email, password, ...data} = userDto
      const mail = email.toLowerCase();
      const auth = await db.querier.user.getAuthByEmail(mail);
        
      if (auth[0]) {
         return {
            status: 400,
            message: 'User account already exists.'
         }
      }

      const hashedPassword = await hasher.hashPasswordHandler(password);
      await db.querier.userTx.createUser(
         {email, password: hashedPassword},
         {user_id: null, ...data}
      );

      return {
         status: 200,
         message: 'User account has been created successfully. Proceed to login.',
      }
   }

   public async loginUser(authDto: IAuth) {
      const email = authDto.email.toLowerCase();
      const auth = await db.querier.user.getAuthByEmail(email);

      if (!auth[0]) {
         return {
            status: 404,
            message: 'User account does not exist.'
         }
      }

      const authWithPassword = await db.querier.user.getAuthById(auth[0].id);

      const isValid = await hasher.comparePassword(authDto.password, authWithPassword[0].password);
      if (!isValid) {
         return {
            status: 400,
            message: 'Wrong password.'
         }
      }

      const payload = {
         email: authWithPassword[0].email,
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