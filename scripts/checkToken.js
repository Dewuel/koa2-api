const jwt = require('jsonwebtoken');
const config = require('../config/index')

module.exports = (auth) => {
  let toke = auth.split(' ')[1];
  let decode = jwt.decode(toke, config.secret)
  return decode;
};