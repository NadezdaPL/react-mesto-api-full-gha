const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
const Unauthorized = require('../Error/Unauthorized');
const { DEV_SECRET, NODE_PRODUCTION } = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Необходимо пройти авторизацию'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === NODE_PRODUCTION ? JWT_SECRET : DEV_SECRET);
  } catch (err) {
    next(new Unauthorized('Необходимо пройти авторизацию'));
  }

  req.user = payload;

  return next();
};
