import dotenv from 'dotenv';

dotenv.config({
   path: './.env'
});

export const CONFIG = {
   DB: process.env.DB_STRING,
   DBHost: process.env.DB_HOST,
   DBPort: process.env.DB_PORT,
   DBUser: process.env.DB_USER,
   DBPassword: process.env.DB_PASSWORD,
   PORT: process.env.PORT || 5050,
   JWTPrivateKey: process.env.JWTPRIVATEKEY,
   JwtAuthExpiration: process.env.JWTXPIRATION,
   BOUND: process.env.SENTIMENT_BOUND,
}