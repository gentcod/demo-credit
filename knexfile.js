export default {
   client: 'mysql2',
   connection: {
      host: process.env.DBHost,
      port: parseInt(process.env.DBPort),
      user: process.env.DBUser,
      password: process.env.DBPassword,
      database: process.env.DB,
   },
   migrations: {
      directory: __dirname + "/src/internal/migrations",
      extension: "ts",
   },
};