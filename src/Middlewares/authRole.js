const checkRole = (permittedRoles) => {
  return (req, res, next) => {
    if (permittedRoles.includes(req.user.role)) {
      return next();
    }

    return res
      .status(403)
      .json({ message: "Seu cargo não tem permissão para isso." });
  };
};

export default checkRole;