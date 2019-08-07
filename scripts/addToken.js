const jwt = require('jsonwebtoken');
const config = require('../config/index')

module.exports = (userinfo) => {
  const token = jwt.sign({
    name: userinfo.name,
    id: userinfo._id,
  }, config.secret, { expiresIn: '1h' });
  return token;
};