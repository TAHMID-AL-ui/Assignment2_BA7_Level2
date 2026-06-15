export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: string | string[];

  constructor(statusCode: number, message: string, errors?: string | string[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
