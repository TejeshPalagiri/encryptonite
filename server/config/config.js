const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');

// dotenv.config();
if (fs.existsSync(path.join(__dirname, "../.env"))) {
  console.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: path.join(__dirname, "../.env") });
} else {
  console.debug("Using .env.example file to supply config environment variables");
  dotenv.config();  // you can delete this after you create your own .env file!
}

module.exports = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_USER: process.env.REDIS_USER,
  JWT_AUTH_SECRET: process.env.JWT_AUTH_SECRET,
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  CRYPTO_KEY: process.env.CRYPTO_KEY,
  version: '1.0.0011702'
};
