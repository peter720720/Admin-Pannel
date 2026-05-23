import jwt from 'jsonwebtoken';

// Verify JWT Token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Check if user is Admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  next();
};

// Optional: Check if user is User (not admin)
export const isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: "Access denied." });
  }
  next();
};
