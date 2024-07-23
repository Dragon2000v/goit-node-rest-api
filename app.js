import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import contactsRouter from './routes/contactsRouter.js';
import { initMongoDBConnection } from './db/innitMongoDBConnection.js';
import { env } from './helpers/env.js';
import authRouter from './routes/authRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  const PORT = Number(env('PORT', 3000));
  await initMongoDBConnection();

  const app = express();

  app.use(morgan('tiny'));
  app.use(cors());
  app.use(express.json());

  // Статичні файли
  app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

  app.use('/users', authRouter);
  app.use('/api/contacts', contactsRouter);

  app.use((_, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
  });

  app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`);
  });
};

startServer();
