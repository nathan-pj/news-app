const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};
require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});
console.log(process.env.PGDATABASE, "<<<<<<<<<<<<<<<<<<<<<<");

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set");
}
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set");
}

module.exports = new Pool(config);
