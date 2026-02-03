import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getProfile, updateProfile, updateProfileValidations } from '../controllers/profileController.js';

const router = Router();

router.use(protect);
router.get('/', getProfile);
router.put('/', updateProfileValidations, validate, updateProfile);

export default router;
