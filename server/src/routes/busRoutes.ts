import { Router } from 'express';
import { getAllBuses, getBusById, getBusSeats, getSimulatedGPS } from '../controllers/busController';

const router = Router();

router.get('/', getAllBuses);
router.get('/gps/live', getSimulatedGPS);
router.get('/:id', getBusById);
router.get('/:id/seats', getBusSeats);

export default router;
