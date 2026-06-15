import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { query } from '../../config/db.js';
import { env } from '../../config/env.js';
import { PublicUser, UserRow } from '../../types/domain.js';
import { AppError } from '../../utils/AppError.js';
import { toPublicUser } from '../../utils/mappers.js';
import { LoginInput, SignupInput } from './auth.types.js';

export const createUser = async (input: SignupInput): Promise<PublicUser> => {
  const existing = await query<UserRow>('SELECT * FROM users WHERE email = $1', [input.email]);

  if (existing.rowCount && existing.rowCount > 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(input.password, env.bcryptSaltRounds);

  const result = await query<UserRow>(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [input.name, input.email, hashedPassword, input.role]
  );

  return toPublicUser(result.rows[0]);
};

export const loginUser = async (input: LoginInput): Promise<{ token: string; user: PublicUser }> => {
  const result = await query<UserRow>('SELECT * FROM users WHERE email = $1', [input.email]);

  if (result.rowCount === 0) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const user = result.rows[0];
  const passwordMatched = await bcrypt.compare(input.password, user.password);

  if (!passwordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn']
  };

  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    env.jwtSecret,
    options
  );

  return { token, user: toPublicUser(user) };
};
