import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../utils/apiResponse.js';
import { createUser, loginUser } from './auth.service.js';
import { validateLogin, validateSignup } from './auth.validation.js';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const input = validateSignup(req.body);
  const user = await createUser(input);

  sendSuccess(res, StatusCodes.CREATED, 'User registered successfully', user);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const input = validateLogin(req.body);
  const data = await loginUser(input);

  sendSuccess(res, StatusCodes.OK, 'Login successful', data);
};
