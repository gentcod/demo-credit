import jwt, { GetPublicKeyOrSecret, Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import logger from "./logger";
import { CONFIG } from '../utils/config';

export interface MyJwtPayload extends JwtPayload {
  email: string;
}

export const signJwt = (payload: Object, duration: string, options: SignOptions = {}) => {
  try {
    const privateKey = CONFIG.JWTPrivateKey;
    return jwt.sign(payload, String(privateKey), {
      ...options,
      expiresIn: duration,
    });
  } catch (error) {
    logger.error(error);
    return;
  }
};

export const verifyJwt = (token: string) => {
  try {
    // @ts-ignore
    const publicKey: Secret | GetPublicKeyOrSecret | string = CONFIG.JWTPrivateKey;
    return jwt.verify(token, publicKey);
  } catch (error) {
    return { status: 401, error }
  }
};
