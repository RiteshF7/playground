// Error Handling Utilities
import { ExecutionResult, ValidationResult } from '../types';

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public category: ErrorCategory,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      category: this.category,
      details: this.details,
      stack: this.stack
    };
  }
}

export type ErrorCategory =
  | 'validation'
  | 'communication'
  | 'hardware'
  | 'execution'
  | 'configuration'
  | 'general';

export class ErrorUtils {
  private static errorLog: AppError[] = [];

  /**
   * Create a custom application error
   */
  static createError(
    message: string,
    code: string,
    category: ErrorCategory,
    details?: any
  ): AppError {
    const error = new AppError(message, code, category, details);
    this.logError(error);
    return error;
  }

  /**
   * Create validation error
   */
  static createValidationError(message: string, details?: any): AppError {
    return this.createError(message, 'VALIDATION_ERROR', 'validation', details);
  }

  /**
   * Create communication error
   */
  static createCommunicationError(message: string, details?: any): AppError {
    return this.createError(message, 'COMMUNICATION_ERROR', 'communication', details);
  }

  /**
   * Create hardware error
   */
  static createHardwareError(message: string, details?: any): AppError {
    return this.createError(message, 'HARDWARE_ERROR', 'hardware', details);
  }

  /**
   * Create execution error
   */
  static createExecutionError(message: string, details?: any): AppError {
    return this.createError(message, 'EXECUTION_ERROR', 'execution', details);
  }

  /**
   * Handle and format unknown errors
   */
  static handleError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return this.createError(error.message, 'UNKNOWN_ERROR', 'general', {
        originalStack: error.stack
      });
    }

    return this.createError(
      String(error),
      'UNKNOWN_ERROR',
      'general'
    );
  }

  /**
   * Convert error to execution result
   */
  static toExecutionResult(error: unknown): ExecutionResult {
    const appError = this.handleError(error);

    return {
      success: false,
      error: appError.message,
      timestamp: Date.now()
    };
  }

  /**
   * Convert error to validation result
   */
  static toValidationResult(error: unknown): ValidationResult {
    const appError = this.handleError(error);

    return {
      isValid: false,
      errors: [appError.message]
    };
  }

  /**
   * Log error for debugging
   */
  private static logError(error: AppError): void {
    this.errorLog.push(error);

    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${error.category.toUpperCase()}] ${error.code}: ${error.message}`, error.details);
    }
  }

  /**
   * Get recent errors
   */
  static getRecentErrors(count: number = 10): AppError[] {
    return this.errorLog.slice(-count);
  }

  /**
   * Clear error log
   */
  static clearErrors(): void {
    this.errorLog = [];
  }

  /**
   * Get errors by category
   */
  static getErrorsByCategory(category: ErrorCategory): AppError[] {
    return this.errorLog.filter(error => error.category === category);
  }

  /**
   * Create user-friendly error message
   */
  static getUserFriendlyMessage(error: AppError): string {
    const friendlyMessages: Record<string, string> = {
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'COMMUNICATION_ERROR': 'Unable to connect to device. Please check connection.',
      'HARDWARE_ERROR': 'Hardware issue detected. Please check your setup.',
      'EXECUTION_ERROR': 'Program execution failed. Please review your code.',
      'CONFIGURATION_ERROR': 'Configuration error. Please check settings.',
      'UNKNOWN_ERROR': 'An unexpected error occurred.'
    };

    return friendlyMessages[error.code] || error.message;
  }

  /**
   * Retry mechanism with exponential backoff
   */
  static async retry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === maxAttempts) {
          break;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw this.handleError(lastError);
  }
}
