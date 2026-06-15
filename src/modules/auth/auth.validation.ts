import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/AppError.js';
import { isNonEmptyString, isUserRole, isValidEmail } from '../../utils/validators.js';
import { LoginBody, LoginInput, SignupBody, SignupInput } from './auth.types.js';

export const validateSignup = (body: SignupBody): SignupInput => {
  const errors: string[] = [];

  if (!isNonEmptyString(body.name)) {
    errors.push('Name is required');
  }

  if (!isNonEmptyString(body.email) || !isValidEmail(body.email)) {
    errors.push('Valid email is required');
  }

  if (!isNonEmptyString(body.password) || body.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  const requestedRole = body.role ?? 'contributor';
  let role: 'contributor' | 'maintainer' = 'contributor';
  if (!isUserRole(requestedRole)) {
    errors.push('Role must be contributor or maintainer');
  } else {
    role = requestedRole;
  }

  if (errors.length > 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Validation failed', errors);
  }

  return {
    name: String(body.name).trim(),
    email: String(body.email).trim().toLowerCase(),
    password: String(body.password),
    role
  };
};

export const validateLogin = (body: LoginBody): LoginInput => {
  const errors: string[] = [];

  if (!isNonEmptyString(body.email) || !isValidEmail(body.email)) {
    errors.push('Valid email is required');
  }

  if (!isNonEmptyString(body.password)) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Validation failed', errors);
  }

  return {
    email: String(body.email).trim().toLowerCase(),
    password: String(body.password)
  };
};
