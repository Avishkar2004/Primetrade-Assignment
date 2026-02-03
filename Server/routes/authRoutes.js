import { Router } from 'express';
import { signup, login, signupValidations, loginValidations } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/signup', authRateLimiter, signupValidations, validate, signup);
router.post('/login', authRateLimiter, loginValidations, validate, login);

export default router;
