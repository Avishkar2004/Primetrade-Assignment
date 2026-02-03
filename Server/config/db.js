import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    logger.error('MONGODB_URI is not set. Create a .env file (copy from .env.example) and set MONGODB_URI.');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}
