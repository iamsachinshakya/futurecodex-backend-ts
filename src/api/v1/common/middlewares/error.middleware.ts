import { Request, Response, NextFunction } from "express";
import { env } from "../../../../app/config/env";
import { ApiResponse } from "../utils/apiResponse";
import logger from "../../../../app/utils/logger";
import { ApiError } from "../utils/apiError";
import { Environment } from "../../../../app/config/constants";

/**
 * Global error-handling middleware for Express
 */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  logger.error("🔥 Error:", err);

  // Handle custom ApiError
  if (err instanceof ApiError && err.isOperational) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  // Fallback for unexpected/unhandled errors
  const message =
    env.NODE_ENV === Environment.DEVELOPMENT
      ? err.stack || err.message
      : "Something went wrong! Please try again later.";

  return ApiResponse.error(res, message, 500);
};
