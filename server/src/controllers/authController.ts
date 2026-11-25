import { Request, Response } from 'express';
import { users } from '../data/mockData';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const login = (req: Request, res: Response) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    return res.status(400).json({ error: 'Student ID and password are required' });
  }

  const cleanId = String(studentId).trim().toUpperCase();
  const cleanPass = String(password).trim();

  const user = users.find(u => u.studentId.toUpperCase() === cleanId);

  if (!user || user.passwordHash !== cleanPass) {
    return res.status(401).json({
      error: 'Invalid student ID or password. Use demo credentials STU2026001 / student123 or STU2026002 / student123.'
    });
  }

  // Generate session token
  const token = `MOCK_TOKEN_${user.studentId}`;

  return res.json({
    message: 'Authentication successful',
    token,
    user: {
      id: user.id,
      studentId: user.studentId,
      name: user.name,
      netId: user.netId,
      email: user.email,
      department: user.department,
      role: user.role,
      passStatus: user.passStatus,
      transitPassId: user.transitPassId,
      biometricSync: user.biometricSync
    }
  });
};

export const getProfile = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = req.user;
  return res.json({
    user: {
      id: user.id,
      studentId: user.studentId,
      name: user.name,
      netId: user.netId,
      email: user.email,
      department: user.department,
      role: user.role,
      passStatus: user.passStatus,
      transitPassId: user.transitPassId,
      biometricSync: user.biometricSync
    }
  });
};
