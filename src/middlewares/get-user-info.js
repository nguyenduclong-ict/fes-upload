const jwt = require('fesjs/lib/jwt');
const { getUser } = _db('providers/base/UserProvider');

module.exports = async function(req, res, next) {
  // Get token from header
  try {
    if (!req.headers.authorization) return next();
    let token = req.headers.authorization.split(' ')[1];
    let tokenData = jwt.verify(token);
    req.user = await getUser({
      username: tokenData.username,
      tokens: { $in: [token] }
    });
    if (req.user) {
      req.user.token_expires_at = new Date(tokenData.exp * 1000);
      req.user.token_expires_in = tokenData.expiresIn;
    }
    req.token = token;
    return next();
  } catch (error) {
    return next(error);
  }
};
