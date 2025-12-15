import express from 'express';
import { bookAppointment, getAppointments, cancelAppointment } from '../controllers/appointmentController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, bookAppointment);
router.get('/', auth, getAppointments);
router.delete('/:id', auth, cancelAppointment);

export default router;