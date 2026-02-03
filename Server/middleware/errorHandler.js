import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: { message: Object.values(err.errors).map((e) => e.message).join('. ') },
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: { message: 'A user with this email already exists.' },
    });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: { message: err.message || 'Internal server error' },
  });
}
