import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/AppError.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { toPositiveInteger } from '../../utils/validators.js';
import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getIssueById,
  updateIssue
} from './issues.service.js';
import { validateCreateIssue, validateIssueQuery, validateUpdateIssue } from './issues.validation.js';

const readIdParam = (id: unknown): number => {
  if (typeof id !== 'string') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Issue id is required');
  }

  const parsedId = toPositiveInteger(id);

  if (!parsedId) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Issue id must be a positive number');
  }

  return parsedId;
};

const requireUser = (req: Request) => {
  if (!req.user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Authentication required');
  }

  return req.user;
};

export const createIssueController = async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req);
  const input = validateCreateIssue(req.body, user.id);
  const issue = await createIssue(input);

  sendSuccess(res, StatusCodes.CREATED, 'Issue created successfully', issue);
};

export const getAllIssuesController = async (req: Request, res: Response): Promise<void> => {
  const options = validateIssueQuery(req.query);
  const issues = await getAllIssues(options);

  sendSuccess(res, StatusCodes.OK, 'Issues retrived successfully', issues);
};

export const getSingleIssueController = async (req: Request, res: Response): Promise<void> => {
  const id = readIdParam(req.params.id);
  const issue = await getIssueById(id);

  sendSuccess(res, StatusCodes.OK, 'Issue retrived successfully', issue);
};

export const updateIssueController = async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req);
  const id = readIdParam(req.params.id);
  const input = validateUpdateIssue(req.body);
  const issue = await updateIssue(id, input, user.id, user.role);

  sendSuccess(res, StatusCodes.OK, 'Issue updated successfully', issue);
};

export const deleteIssueController = async (req: Request, res: Response): Promise<void> => {
  const id = readIdParam(req.params.id);
  await deleteIssue(id);

  sendSuccess(res, StatusCodes.OK, 'Issue deleted successfully');
};
