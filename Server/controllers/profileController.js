import { User } from '../models/userModel.js';
import { updateProfileValidations } from '../utils/validateUser.js';

export { updateProfileValidations };

export async function getProfile(req, res, next) {
  try {
    res.json({ success: true, data: { user: req.user } });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, email } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (Object.keys(updates).length === 0) {
      return res.json({ success: true, data: { user: req.user } });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}
