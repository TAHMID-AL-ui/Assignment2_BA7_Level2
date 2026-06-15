import { Pool, QueryResult, QueryResultRow } from 'pg';
import { env } from './env.js';

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
});

export const query = async <T extends QueryResultRow>(text: string, params: unknown[] = []): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};
