const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: "access denied" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "insufficient permissions" });
    }

    next();
  };
};

export default roleMiddleware;
