//Import  JsonWebToken 
const jwt = require('jsonwebtoken');

//Routes verifie le  TOKEN de l'utilisateur, si il est identique à l'id de l'utilisateur qui fait sa requête, alors les modification seront autorisées 
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TK_SESSION);// token afin d'avoir accés aux sauces
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
