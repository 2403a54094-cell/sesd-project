import { Request, Response, NextFunction } from 'express';
import { users, User } from '../data/mockData';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    // For convenience in demo, default to Alex Chen if no auth header passed
    req.user = users[0];
    return next();
  }

  const token = authHeader.replace('Bearer ', '').trim();
  // Token format: "MOCK_TOKEN_<studentId>" or just studentId
  const studentId = token.startsWith('MOCK_TOKEN_') ? token.replace('MOCK_TOKEN_', '') : token;

  const foundUser = users.find(u => u.studentId.toUpperCase() === studentId.toUpperCase());
  if (!foundUser) {
    return res.status(401).json({ error: 'Unauthorized: Invalid student credentials or session expired' });
  }

  req.user = foundUser;
  next();
};
