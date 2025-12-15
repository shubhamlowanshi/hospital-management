import express from 'express';
import { getDoctors, getPatients, getAllUsers, getProfile } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/doctors', auth, getDoctors);
router.get('/patients', auth, getPatients);
router.get('/all', auth, getAllUsers);
router.get('/profile', auth, getProfile);

export default router;