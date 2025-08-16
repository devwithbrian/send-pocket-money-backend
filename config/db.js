import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: 'send_pocket_money' });
  console.log('MongoDB connected');
}
