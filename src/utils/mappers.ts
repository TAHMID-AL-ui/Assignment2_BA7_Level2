import { IssueRow, IssueWithReporter, PublicUser, Reporter, UserRow } from '../types/domain.js';

export const toPublicUser = (user: UserRow): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at,
  updated_at: user.updated_at
});

export const attachReporter = (issue: IssueRow, reporters: Map<number, Reporter>): IssueWithReporter => ({
  id: issue.id,
  title: issue.title,
  description: issue.description,
  type: issue.type,
  status: issue.status,
  reporter: reporters.get(issue.reporter_id) ?? null,
  created_at: issue.created_at,
  updated_at: issue.updated_at
});
