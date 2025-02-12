// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Expected format: "Bearer <token>"
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden if token is invalid
      }
      // Attach the decoded token (user info) to req.user
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized if no token provided
  }
};
