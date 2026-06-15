import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/AppError.js';
import { isIssueStatus, isIssueType, isNonEmptyString } from '../../utils/validators.js';
import {
  CreateIssueBody,
  CreateIssueInput,
  IssueQueryOptions,
  UpdateIssueBody,
  UpdateIssueInput
} from './issues.types.js';

const validateTitle = (title: unknown, errors: string[]): string | undefined => {
  if (title === undefined) return undefined;

  if (!isNonEmptyString(title)) {
    errors.push('Title is required');
    return undefined;
  }

  const cleanTitle = title.trim();
  if (cleanTitle.length > 150) {
    errors.push('Title must not exceed 150 characters');
  }

  return cleanTitle;
};

const validateDescription = (description: unknown, errors: string[]): string | undefined => {
  if (description === undefined) return undefined;

  if (!isNonEmptyString(description)) {
    errors.push('Description is required');
    return undefined;
  }

  const cleanDescription = description.trim();
  if (cleanDescription.length < 20) {
    errors.push('Description must be at least 20 characters long');
  }

  return cleanDescription;
};

export const validateCreateIssue = (body: CreateIssueBody, reporterId: number): CreateIssueInput => {
  const errors: string[] = [];
  const title = validateTitle(body.title, errors);
  const description = validateDescription(body.description, errors);

  let issueType: 'bug' | 'feature_request' = 'bug';
  if (!isIssueType(body.type)) {
    errors.push('Type must be bug or feature_request');
  } else {
    issueType = body.type;
  }

  if (!title || !description || errors.length > 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Validation failed', errors);
  }

  return { title, description, type: issueType, reporterId };
};

export const validateUpdateIssue = (body: UpdateIssueBody): UpdateIssueInput => {
  const errors: string[] = [];
  const input: UpdateIssueInput = {};

  const title = validateTitle(body.title, errors);
  if (title !== undefined) input.title = title;

  const description = validateDescription(body.description, errors);
  if (description !== undefined) input.description = description;

  if (body.type !== undefined) {
    if (!isIssueType(body.type)) errors.push('Type must be bug or feature_request');
    else input.type = body.type;
  }

  // Maintainers can use the same PATCH route to move workflow status.
  // Contributors are blocked from this in the service permission check.
  if (body.status !== undefined) {
    if (!isIssueStatus(body.status)) errors.push('Status must be open, in_progress, or resolved');
    else input.status = body.status;
  }

  if (!input.title && !input.description && !input.type && !input.status) {
    errors.push('At least one field must be provided for update');
  }

  if (errors.length > 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Validation failed', errors);
  }

  return input;
};

export const validateIssueQuery = (query: Record<string, unknown>): IssueQueryOptions => {
  const errors: string[] = [];
  const sort = query.sort === undefined ? 'newest' : query.sort;

  if (sort !== 'newest' && sort !== 'oldest') {
    errors.push('Sort must be newest or oldest');
  }

  let type: IssueQueryOptions['type'];
  if (query.type !== undefined) {
    if (!isIssueType(query.type)) errors.push('Type filter must be bug or feature_request');
    else type = query.type;
  }

  let status: IssueQueryOptions['status'];
  if (query.status !== undefined) {
    if (!isIssueStatus(query.status)) errors.push('Status filter must be open, in_progress, or resolved');
    else status = query.status;
  }

  if (errors.length > 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Validation failed', errors);
  }

  return {
    sort: sort === 'oldest' ? 'oldest' : 'newest',
    type,
    status
  };
};
