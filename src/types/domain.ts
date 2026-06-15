import { QueryResultRow } from 'pg';
export type UserRole = 'contributor' | 'maintainer';
export type IssueType = 'bug' | 'feature_request';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface UserRow extends QueryResultRow {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Reporter extends QueryResultRow {
  id: number;
  name: string;
  role: UserRole;
}

export interface IssueRow extends QueryResultRow {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IssueWithReporter extends Omit<IssueRow, 'reporter_id'> {
  reporter: Reporter | null;
}

export interface JwtUserPayload {
  id: number;
  name: string;
  role: UserRole;
}
