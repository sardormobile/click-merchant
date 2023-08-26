const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.DB_CONNECTION_URL,
  CLICK_SECRET_KEY: process.env.CLICK_SECRET_KEY,
};
