export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only access" });
  }
  next();
};

export const isStaff = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({ message: "Staff only access" });
  }
  next();
};

export const isAdminOrStaff = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};