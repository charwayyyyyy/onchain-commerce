import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ActionResponse<T = any> = 
  | { success: true; data: T; message?: string; error?: never }
  | { success: false; error: string; data?: never; message?: never };

/**
 * Standardized error handler for server actions.
 * Logs the error safely and returns a consistent error object.
 */
export function handleActionError(error: any, actionName: string, userId?: string): ActionResponse<any> {
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  
  // Safe logging (exclude sensitive data)
  console.error(`[ACTION_ERROR][${actionName}]`, {
    userId,
    message,
    timestamp: new Date().toISOString(),
  });

  return {
    success: false,
    error: message,
  };
}

/**
 * Standardized success response for server actions.
 */
export function actionSuccess<T>(data: T, message?: string): ActionResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}
