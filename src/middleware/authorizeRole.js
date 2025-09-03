// middleware/authorizeRole.js
const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const role = req.user?.roleCode;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        errCode: 403,
        message: "Forbidden: You don't have permission to access this resource.",
      });
    }
    next();
  };
};

module.exports = authorizeRole;
