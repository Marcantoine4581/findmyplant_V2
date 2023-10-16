/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    jwt.verify(token, process.env.SECRET_TOKEN, (err) => {
      if (err) {
        return res.status(401).json({ message: 'Merci de vous authentifier.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Merci de vous authentifier.' });
  }
};

module.exports = auth;
