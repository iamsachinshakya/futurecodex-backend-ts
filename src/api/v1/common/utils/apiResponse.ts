import { Response } from "express";

/**
 * A standard API response helper for consistent response structure.
 */
export class ApiResponse {
  public success: boolean;
  public message: string;
  public statusCode: number;
  public data?: any;
  public meta?: any;
  public errors?: any;

  constructor(
    success: boolean,
    message: string,
    data: any = null,
    statusCode: number = 200,
    meta: any = null
  ) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    if (data !== null) this.data = data;
    if (meta !== null) this.meta = meta;
  }

  /**
   * Send a successful response
   */
  static success(
    res: Response,
    message: string = "Success",
    data: any = null,
    statusCode: number = 200,
    meta: any = null
  ) {
    const response = new ApiResponse(true, message, data, statusCode, meta);
    return res.status(statusCode).json(response);
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    message: string = "Error",
    statusCode: number = 500,
    errors: any = null
  ) {
    const response = new ApiResponse(false, message, null, statusCode);
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }
}
