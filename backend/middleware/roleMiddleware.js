export const admin = (req, res, next) => {
  // support both cases: Admin and admin
  if (req.user?.role !== "Admin" && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only access" });
  }
  if (typeof next === "function") return next();
  return res.end();
};

export const isStaff = (req, res, next) => {
  if (req.user?.role !== "staff" && req.user?.role !== "Staff") {
    return res.status(403).json({ message: "Staff only access" });
  }
  if (typeof next === "function") return next();
  return res.end();
};

export const isAdminOrStaff = (req, res, next) => {
  if (
    req.user?.role !== "admin" &&
    req.user?.role !== "Admin" &&
    req.user?.role !== "staff" &&
    req.user?.role !== "Staff"
  ) {
    return res.status(403).json({ message: "Access denied" });
  }
  if (typeof next === "function") return next();
  return res.end();
};
