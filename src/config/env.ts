import dotenv from 'dotenv';

dotenv.config();

const readRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const parseSaltRounds = (value: string | undefined): number => {
  const rounds = Number(value ?? '10');

  if (!Number.isInteger(rounds) || rounds < 8 || rounds > 12) {
    throw new Error('BCRYPT_SALT_ROUNDS must be an integer between 8 and 12');
  }

  return rounds;
};

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: readRequiredEnv('DATABASE_URL'),
  jwtSecret: readRequiredEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  bcryptSaltRounds: parseSaltRounds(process.env.BCRYPT_SALT_ROUNDS),
  corsOrigin: process.env.CORS_ORIGIN ?? '*'
};
