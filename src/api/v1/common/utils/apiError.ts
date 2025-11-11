/**
 * Custom error class for handling operational (expected) errors gracefully.
 */
export class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public errors: any | null;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    errors: any = null
  ) {
    super(message);

    // Assign class properties
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.isOperational = true; // distinguishes expected errors from programming bugs

    // Fix prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
