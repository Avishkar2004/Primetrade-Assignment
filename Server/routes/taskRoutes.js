import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  createTaskValidations,
  updateTaskValidations,
} from '../controllers/taskController.js';

const router = Router();

router.use(protect);
router.get('/', listTasks);
router.get('/:id', getTask);
router.post('/', createTaskValidations, validate, createTask);
router.put('/:id', updateTaskValidations, validate, updateTask);
router.delete('/:id', deleteTask);

export default router;
