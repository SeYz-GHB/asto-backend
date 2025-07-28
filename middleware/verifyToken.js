import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token; // Access the token from cookies

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // typo: JST_SECRET → JWT_SECRET
    req.userId = decoded.id; // Set decoded id to req
    next(); // Proceed to next middleware
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - invalid or expired token",
    });
  }
};
/* so do we really need generateTokenAndsetcookie in signup? becucase after fil signup we have to move to verifypage */