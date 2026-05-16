// src/middlewares/authenticate.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '@/modules/auth/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extend Express Request to include admin payload
declare global {
  namespace Express {
    interface Request {
      admin?: AuthTokenPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};