require("dotenv").config()

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "agrotrack_db",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_TEST_NAME || "agrotrack_test_db",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
}
