import mongoose from 'mongoose';
import { env } from '../helpers/env.js';

export const initMongoDBConnection = async () => {
  try {
    const user = env('MONGODB_USER');
    const password = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const name = env('MONGODB_NAME');
    const DB_HOST = `mongodb+srv://${user}:${password}@${url}/${name}?retryWrites=true&w=majority&appName=DragonData`;
    await mongoose.connect(DB_HOST);
    console.log('Database connection successful');
  } catch (error) {
    console.log('Database connection failed - ', error.message);
    process.exit(1);
  }
};
