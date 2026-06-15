import { IssueStatus, IssueType } from '../../types/domain.js';

export interface CreateIssueBody {
  title?: unknown;
  description?: unknown;
  type?: unknown;
}

export interface UpdateIssueBody {
  title?: unknown;
  description?: unknown;
  type?: unknown;
  status?: unknown;
}

export interface CreateIssueInput {
  title: string;
  description: string;
  type: IssueType;
  reporterId: number;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  type?: IssueType;
  status?: IssueStatus;
}

export interface IssueQueryOptions {
  sort: 'newest' | 'oldest';
  type?: IssueType;
  status?: IssueStatus;
}
