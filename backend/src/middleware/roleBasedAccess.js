// backend/src/middleware/roleBasedAccess.js

function authorizeRole(roles) {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Authorization failed: Insufficient permissions' });
      }
      next();
    };
  }
  
  module.exports = authorizeRole;