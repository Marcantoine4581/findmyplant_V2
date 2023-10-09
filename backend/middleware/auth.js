const jwt = require('jsonwebtoken');
 
const auth = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'SECRET_TOKEN');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ message: 'Merci de vous authentifier.' });
   }
};

module.exports = auth;