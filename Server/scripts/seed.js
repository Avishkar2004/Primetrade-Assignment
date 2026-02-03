import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/userModel.js';
import { Task } from '../models/taskModel.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
  await Task.deleteMany({});

  const users = await User.create([
    { email: 'demo@primetrade.ai', password: 'Demo123!', name: 'Demo User' },
    { email: 'john@example.com', password: 'John123!', name: 'John Doe' },
    { email: 'jane@example.com', password: 'Jane123!', name: 'Jane Smith' },
  ]);

  await Task.insertMany([
    { title: 'Complete assignment', description: 'Frontend + Backend task', status: 'in_progress', priority: 'high', userId: users[0]._id },
    { title: 'Review PR', description: 'Code review for auth module', status: 'todo', priority: 'medium', userId: users[0]._id },
    { title: 'Write tests', description: 'Unit tests for API', status: 'done', priority: 'medium', userId: users[0]._id },
  ]);

  console.log('Seed done. Demo credentials:');
  console.log('  demo@primetrade.ai / Demo123!');
  console.log('  john@example.com / John123!');
  console.log('  jane@example.com / Jane123!');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
