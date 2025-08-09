/**
 * @class AppError
 * @description A base class for custom application errors.
 * @extends Error
 */
export class AppError extends Error {
  public readonly statusCode: number;

  /**
   * @constructor
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code.
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * @class UserNotFoundError
 * @description An error for when a user is not found.
 * @extends AppError
 */
export class UserNotFoundError extends AppError {
  constructor() {
    super('User not found', 404);
  }
}

/**
 * @class InvalidCredentialsError
 * @description An error for when invalid credentials are provided.
 * @extends AppError
 */
export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid credentials', 401);
  }
}

/**
 * @class UserAlreadyExistsError
 * @description An error for when a user already exists.
 * @extends AppError
 */
export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('User already exists', 409);
  }
}

/**
 * @class BadRequestError
 * @description An error for a bad request.
 * @extends AppError
 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

/**
 * @class MethodNotAllowedError
 * @description An error for a method that is not allowed.
 * @extends AppError
 */
export class MethodNotAllowedError extends AppError {
  constructor() {
    super('Method Not Allowed', 405);
  }
}