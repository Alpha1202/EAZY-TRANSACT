const dotenv = require('dotenv');

dotenv.config();

module.exports = {
port: process.env.PORT || 2020,
secret: process.env.SECRET_KEY
}