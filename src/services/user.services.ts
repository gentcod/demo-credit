import { v4 as uuidv4 } from 'uuid';
import { db } from "../db";
import { IAuth } from "../internal/models/Auth";
import { hasher } from "../utils/bcrypt";
import { CONFIG } from "../utils/config";
import { signJwt } from "../utils/jwt";
import { UserDto } from "../dtos/user.dto";
import { ApiResponse } from "../utils/apiResponse";
import { LendsqrAdjutor } from './third-party/adjutor.services';

export class AuthServies {
   public async createUser(userDto: UserDto): Promise<ApiResponse<any>> {
      const { email, password, ...data } = userDto;
      const mail = email.toLowerCase();
      const auth = await db.querier.user.getAuthByEmail(mail);
      if (auth[0]) {
         return {
            status: 400,
            message: 'User account already exists.'
         }
      }

      const adjutorResp = await new LendsqrAdjutor().checkKarama(email); 
      if (adjutorResp.isError) {
         return {
            status: adjutorResp.data.status,
            message: `Signup failed. Error validating karma blacklist status.`,
         }
      }

      if (adjutorResp.isError || adjutorResp.data.result != null) {
         return {
            status: adjutorResp.data.status,
            message: `Signup failed as you have been blacklisted on Karma.`,
         }
      }

      const hashedPassword = await hasher.hashPasswordHandler(password);
      await db.querier.userTx.createUser(
         { id: uuidv4(), email, password: hashedPassword },
         { user_id: null, ...data }
      );

      return {
         status: 200,
         message: 'User account has been created successfully. Proceed to login.',
      }
   }

   public async loginUser(authDto: IAuth): Promise<ApiResponse<any>> {
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

      const profile = await db.querier.profile.getProfile(auth[0].id)

      const payload = {
         email: authWithPassword[0].email,
         user_id: authWithPassword[0].id,
         first_name: profile[0].first_name,
         last_name: profile[0].last_name,
         created_at: profile[0].created_at,
         updated_at: profile[0].updated_at,
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