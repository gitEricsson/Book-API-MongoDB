import express from 'express';
import { Request, Response, NextFunction, Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
// const compression = require('compression');

import { AppError } from './utils/appError';
import globalErrorHandler from './controllers/errorController';
import bookRouter from './routes/bookRoutes';

const app: Application = express();

// Global MiddleWares

// Security HTTP Headers
app.use(helmet({ contentSecurityPolicy: false }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// compress responses
// app.use(compression());

// Test middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// Routes
app.use('/api/books', bookRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
});

app.use(globalErrorHandler);

export default app;
