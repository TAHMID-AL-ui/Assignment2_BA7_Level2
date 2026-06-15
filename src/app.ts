import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { issueRoutes } from './modules/issues/issues.routes.js';
import { sendSuccess } from './utils/apiResponse.js';
import { StatusCodes } from 'http-status-codes';

export const app = express();

app.use(cors({ origin: env.corsOrigin === '*' ? '*' : env.corsOrigin.split(',') }));
app.use(express.json());

app.get('/', (_req, res) => {
  sendSuccess(res, StatusCodes.OK, 'DevPulse API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

app.use(notFound);
app.use(errorHandler);
