import { Response } from 'express';

export const sendSuccess = <T>(res: Response, statusCode: number, message: string, data?: T): Response => {
  const body = data === undefined
    ? { success: true, message }
    : { success: true, message, data };

  return res.status(statusCode).json(body);
};

export const sendError = (res: Response, statusCode: number, message: string, errors?: string | string[]): Response => {
  const body = errors === undefined
    ? { success: false, message }
    : { success: false, message, errors };

  return res.status(statusCode).json(body);
};
