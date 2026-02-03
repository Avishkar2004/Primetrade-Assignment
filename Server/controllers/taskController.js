import { Task } from '../models/taskModel.js';
import { body } from 'express-validator';

export const createTaskValidations = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title too long'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description too long'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
];

export const updateTaskValidations = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }).withMessage('Title too long'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description too long'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
];

export async function listTasks(req, res, next) {
  try {
    const { search, status, priority, sort = '-createdAt', page = 1, limit = 10 } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search?.trim()) {
      filter.$or = [
        { title: new RegExp(search.trim(), 'i') },
        { description: new RegExp(search.trim(), 'i') },
      ];
    }
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(total / limitNum) || 1;
    res.json({
      success: true,
      data: {
        tasks,
        pagination: { page: pageNum, limit: limitNum, total, totalPages },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id }).lean();
    if (!task) {
      return res.status(404).json({ success: false, error: { message: 'Task not found.' } });
    }
    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const task = await Task.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ success: false, error: { message: 'Task not found.' } });
    }
    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) {
      return res.status(404).json({ success: false, error: { message: 'Task not found.' } });
    }
    res.json({ success: true, data: { message: 'Task deleted.' } });
  } catch (err) {
    next(err);
  }
}
