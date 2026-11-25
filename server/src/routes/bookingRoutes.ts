import { Router } from 'express';
import { getMyBookings, createBooking, cancelBooking } from '../controllers/bookingController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getMyBookings);
router.post('/', createBooking);
router.delete('/:id', cancelBooking);

export default router;
