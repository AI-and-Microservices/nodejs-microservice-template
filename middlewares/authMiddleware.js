const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.error('Unauthorized', 401);

  try {
    console.log(process.env.JWT_SECRET)
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.error('Token has expired', 401);
    }

    return res.error('Invalid token', 401);
  }
}

module.exports = authMiddleware;