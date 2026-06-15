import { UserRole } from '../../types/domain.js';

export interface SignupBody {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  role?: unknown;
}

export interface LoginBody {
  email?: unknown;
  password?: unknown;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}
