import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { requireAuth } from './middleware/auth.js';
import { permit } from './middleware/roles.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.warn('MONGO_URI is not set in environment. Please set MONGO_URI in server/.env or environment.');
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    app.use('/api/auth', authRoutes);

    // example protected endpoints
    app.get('/api/me', requireAuth, (req, res) => {
      res.json({ user: req.user });
    });

    app.get('/api/admin-only', requireAuth, permit('admin'), (req, res) => {
      res.json({ message: 'Hello admin', user: req.user });
    });

    app.get('/api/owner-or-admin', requireAuth, permit('owner', 'admin'), (req, res) => {
      res.json({ message: 'Hello owner or admin', user: req.user });
    });

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
