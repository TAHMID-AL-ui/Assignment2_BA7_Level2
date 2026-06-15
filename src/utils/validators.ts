import { IssueStatus, IssueType, UserRole } from '../types/domain.js';

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isUserRole = (value: unknown): value is UserRole => {
  return value === 'contributor' || value === 'maintainer';
};

export const isIssueType = (value: unknown): value is IssueType => {
  return value === 'bug' || value === 'feature_request';
};

export const isIssueStatus = (value: unknown): value is IssueStatus => {
  return value === 'open' || value === 'in_progress' || value === 'resolved';
};

export const toPositiveInteger = (value: string): number | null => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};
