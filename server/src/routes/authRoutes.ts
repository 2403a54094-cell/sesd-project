import { Router } from 'express';
import { login, getProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.get('/me', authMiddleware, getProfile);

export default router;
