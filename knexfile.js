module.exports = {
   client: 'mysql2',
   connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_STRING,
   },
   migrations: {
      directory: __dirname + "/src/internal/migrations",
      extension: "ts",
   },
};