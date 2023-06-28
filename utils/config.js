require('dotenv').config();

const { PORT = '3000' } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { NODE_ENV = 'production' } = process.env;
const { JWT_SECRET = 'de8a252d1e03dbcb4c834db8193d669b9347d41c2a5042df3ff15d1e5a79337e' } = process.env;

module.exports = {
  PORT,
  DB_ADDRESS,
  NODE_ENV,
  JWT_SECRET,
};
