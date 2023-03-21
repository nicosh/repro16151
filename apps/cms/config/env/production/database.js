const path = require("path");

module.exports = ({ env }) => ({
  connection: {
    client: "mysql",
    connection: {
      host: env("PROD_HOST"),
      user: env("PROD_USER"),
      port: env.int("PROD_DATABASE_PORT", 3306),
      password: env("PROD_PASSWORD"),
      database: env("PROD_DB"),
    },
    useNullAsDefault: true,
  },
});
