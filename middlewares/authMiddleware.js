import jwt from 'jsonwebtoken';
import {User} from '../models/user.models.js'; // Ensure the User model file uses ES Module syntax or has a .js extension
import dotenv from 'dotenv';

dotenv.config(); // Ensure env variables are loaded

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify Token
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token. Authentication failed.' });
  }
};

export default authMiddleware;
