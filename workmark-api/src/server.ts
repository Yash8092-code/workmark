import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import { startAdzunaSync } from './services/adzuna-sync.service';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 500 : 10000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== 'production' && (req.ip === '::1' || req.ip === '127.0.0.1'),
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // Allow any localhost port in development
      if (/^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }
      // Allow any Vercel deployment domain
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      // Allow explicit CLIENT_URL if defined
      const allowed = process.env.CLIENT_URL;
      if (allowed && origin === allowed) return callback(null, true);
      // Default allow for public access
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ensure MongoDB is connected for every serverless request
app.use(async (_req, _res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api', limiter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Workmark API',
    version: '1.0.0',
  });
});

app.use('/api', routes);

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  await connectDB();
  startAdzunaSync();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

// Only bind to local port when not running as a Vercel Serverless Function
if (!process.env.VERCEL) {
  void startServer();
}

export default app;
