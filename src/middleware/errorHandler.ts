import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError.js';
import { sendError } from '../utils/apiResponse.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  console.error(err);
  sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
};
