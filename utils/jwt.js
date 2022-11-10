const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./constants');

const signToken = (_id) => {
  try {
    const token = jwt.sign({ _id }, JWT_SECRET);
    return token;
  } catch (err) {
    return false;
  }
};

module.exports = {
  signToken,
};
