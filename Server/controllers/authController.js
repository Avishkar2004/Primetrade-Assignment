import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { signupValidations, loginValidations } from '../utils/validateUser.js';

const tokenPayload = (user) => ({ id: user._id, email: user.email });

export { signupValidations, loginValidations };

export async function signup(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { message: 'A user with this email already exists.' },
      });
    }
    const user = await User.create({ email, password, name });
    const token = jwt.sign(
      tokenPayload(user),
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.status(201).json({
      success: true,
      data: { user: { id: user._id, email: user.email, name: user.name }, token },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: { message: 'Invalid email or password.' } });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, error: { message: 'Invalid email or password.' } });
    }
    const token = jwt.sign(
      tokenPayload(user),
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.json({
      success: true,
      data: { user: { id: user._id, email: user.email, name: user.name }, token },
    });
  } catch (err) {
    next(err);
  }
}
