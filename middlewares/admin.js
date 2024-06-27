const authorizeAdmin = (req, res, next) => {
  // 401 unauthorized
  // 403 forbidden
  console.log(req.user);
  if (!req.user.isAdmin) return res.status(403).send("User is not authorized");
  next();
};

module.exports = authorizeAdmin;
