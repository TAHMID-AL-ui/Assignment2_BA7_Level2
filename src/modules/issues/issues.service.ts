import { StatusCodes } from 'http-status-codes';
import { query } from '../../config/db.js';
import { IssueRow, IssueWithReporter, Reporter, UserRole } from '../../types/domain.js';
import { AppError } from '../../utils/AppError.js';
import { attachReporter } from '../../utils/mappers.js';
import { CreateIssueInput, IssueQueryOptions, UpdateIssueInput } from './issues.types.js';

const getReporterMap = async (reporterIds: number[]): Promise<Map<number, Reporter>> => {
  const uniqueIds = [...new Set(reporterIds)];

  if (uniqueIds.length === 0) {
    return new Map();
  }

  const result = await query<Reporter>(
    'SELECT id, name, role FROM users WHERE id = ANY($1::int[])',
    [uniqueIds]
  );

  return new Map(result.rows.map((reporter) => [reporter.id, reporter]));
};

export const createIssue = async (input: CreateIssueInput): Promise<IssueRow> => {
  const result = await query<IssueRow>(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [input.title, input.description, input.type, input.reporterId]
  );

  return result.rows[0];
};

export const getAllIssues = async (options: IssueQueryOptions): Promise<IssueWithReporter[]> => {
  const whereParts: string[] = [];
  const values: unknown[] = [];

  if (options.type) {
    values.push(options.type);
    whereParts.push(`type = $${values.length}`);
  }

  if (options.status) {
    values.push(options.status);
    whereParts.push(`status = $${values.length}`);
  }

  const whereSql = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';
  const orderSql = options.sort === 'oldest' ? 'ASC' : 'DESC';

  const issues = await query<IssueRow>(
    `SELECT * FROM issues ${whereSql} ORDER BY created_at ${orderSql}`,
    values
  );

  const reporters = await getReporterMap(issues.rows.map((issue) => issue.reporter_id));
  return issues.rows.map((issue) => attachReporter(issue, reporters));
};

export const getIssueById = async (id: number): Promise<IssueWithReporter> => {
  const issueResult = await query<IssueRow>('SELECT * FROM issues WHERE id = $1', [id]);

  if (issueResult.rowCount === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');
  }

  const issue = issueResult.rows[0];
  const reporters = await getReporterMap([issue.reporter_id]);
  return attachReporter(issue, reporters);
};

const getIssueRowById = async (id: number): Promise<IssueRow> => {
  const result = await query<IssueRow>('SELECT * FROM issues WHERE id = $1', [id]);

  if (result.rowCount === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');
  }

  return result.rows[0];
};

const ensureCanEditIssue = (issue: IssueRow, userId: number, role: UserRole): void => {
  if (role === 'maintainer') {
    return;
  }

  if (issue.reporter_id !== userId) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Contributors can update only their own issues');
  }

  if (issue.status !== 'open') {
    throw new AppError(StatusCodes.CONFLICT, 'Only open issues can be updated by contributors');
  }
};

export const updateIssue = async (
  id: number,
  input: UpdateIssueInput,
  userId: number,
  role: UserRole
): Promise<IssueRow> => {
  const issue = await getIssueRowById(id);
  ensureCanEditIssue(issue, userId, role);

  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.title !== undefined) {
    values.push(input.title);
    fields.push(`title = $${values.length}`);
  }

  if (input.description !== undefined) {
    values.push(input.description);
    fields.push(`description = $${values.length}`);
  }

  if (input.type !== undefined) {
    values.push(input.type);
    fields.push(`type = $${values.length}`);
  }

  if (input.status !== undefined) {
    if (role !== 'maintainer') {
      throw new AppError(StatusCodes.FORBIDDEN, 'Only maintainers can update issue status');
    }

    values.push(input.status);
    fields.push(`status = $${values.length}`);
  }

  values.push(id);

  const result = await query<IssueRow>(
    `UPDATE issues
     SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  return result.rows[0];
};

export const deleteIssue = async (id: number): Promise<void> => {
  const result = await query<IssueRow>('DELETE FROM issues WHERE id = $1 RETURNING *', [id]);

  if (result.rowCount === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');
  }
};
