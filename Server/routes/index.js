import { Router } from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import taskRoutes from './taskRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/me', profileRoutes);
router.use('/tasks', taskRoutes);

export default router;
