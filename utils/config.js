require('dotenv').config();

const { PORT = '3000' } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { NODE_ENV = 'production' } = process.env;

module.exports = {
  PORT,
  DB_ADDRESS,
  NODE_ENV,
};
