import dotenv from 'dotenv';

dotenv.config({
   path: './.env'
});

export const CONFIG = {
   DB: process.env.DB_STRING,
   PORT: process.env.PORT || 5050,
   JWTPrivateKey: process.env.JWTPRIVATEKEY,
   JwtAuthExpiration: process.env.JWTXPIRATION,
   BOUND: process.env.SENTIMENT_BOUND,
}