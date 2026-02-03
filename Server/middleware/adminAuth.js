/**
 * Admin authentication middleware.
 * Use after protect(). Rejects unless user has role === 'admin'. Extend userModel with role when needed.
 */
export function adminAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: { message: 'Not authorized.' } });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: { message: 'Admin access required.' } });
  }
  next();
}
