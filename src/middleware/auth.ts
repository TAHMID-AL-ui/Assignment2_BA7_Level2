import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/env.js';
import { JwtUserPayload } from '../types/domain.js';
import { AppError } from '../utils/AppError.js';

interface TokenBody extends JwtUserPayload {
  iat?: number;
  exp?: number;
}

const isTokenBody = (payload: string | jwt.JwtPayload): payload is TokenBody => {
  if (typeof payload === 'string') {
    return false;
  }

  return typeof payload.id === 'number'
    && typeof payload.name === 'string'
    && (payload.role === 'contributor' || payload.role === 'maintainer');
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    next(new AppError(StatusCodes.UNAUTHORIZED, 'Authorization token is required'));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (!isTokenBody(decoded)) {
      next(new AppError(StatusCodes.UNAUTHORIZED, 'Invalid token payload'));
      return;
    }

    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role
    };

    next();
  } catch {
    next(new AppError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token'));
  }
};

export const requireMaintainer: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication required'));
    return;
  }

  if (req.user.role !== 'maintainer') {
    next(new AppError(StatusCodes.FORBIDDEN, 'Maintainer access required'));
    return;
  }

  next();
};
