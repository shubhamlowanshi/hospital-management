import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: 'https://hospital-management-eosin-ten.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ❌ app.options('*', cors());  <-- REMOVE THIS LINE

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Hospital API is running' });
});

connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
