module.exports = function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      const userRoles = req?.user?.roles;
  
      if (!userRoles || !Array.isArray(userRoles)) {
        return res.error('Access denied. No roles found.', 403);
      }
  
      const hasRole = userRoles.some(role => allowedRoles.includes(role));
  
      if (!hasRole) {
        return res.error('Access denied. Insufficient permissions.', 403);
      }
  
      next();
    };
  };
  