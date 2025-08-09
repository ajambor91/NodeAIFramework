import {
  AppError,
  UserNotFoundError,
  InvalidCredentialsError,
  UserAlreadyExistsError,
  BadRequestError,
  MethodNotAllowedError,
} from '../../errors/errors';

/**
 * @fileoverview This file contains the test suite for the custom error classes.
 */
describe('Custom Errors', () => {
  /**
   * @description This test case verifies that an AppError can be created with a message and status code.
   */
  it('should create an AppError with a message and status code', () => {
    const error = new AppError('Test error', 500);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
  });

  /**
   * @description This test case verifies that a UserNotFoundError can be created.
   */
  it('should create a UserNotFoundError', () => {
    const error = new UserNotFoundError();
    expect(error).toBeInstanceOf(UserNotFoundError);
    expect(error.message).toBe('User not found');
    expect(error.statusCode).toBe(404);
  });

  /**
   * @description This test case verifies that an InvalidCredentialsError can be created.
   */
  it('should create an InvalidCredentialsError', () => {
    const error = new InvalidCredentialsError();
    expect(error).toBeInstanceOf(InvalidCredentialsError);
    expect(error.message).toBe('Invalid credentials');
    expect(error.statusCode).toBe(401);
  });

  /**
   * @description This test case verifies that a UserAlreadyExistsError can be created.
   */
  it('should create a UserAlreadyExistsError', () => {
    const error = new UserAlreadyExistsError();
    expect(error).toBeInstanceOf(UserAlreadyExistsError);
    expect(error.message).toBe('User already exists');
    expect(error.statusCode).toBe(409);
  });

  /**
   * @description This test case verifies that a BadRequestError can be created with a default message.
   */
  it('should create a BadRequestError with a default message', () => {
    const error = new BadRequestError();
    expect(error).toBeInstanceOf(BadRequestError);
    expect(error.message).toBe('Bad Request');
    expect(error.statusCode).toBe(400);
  });

  /**
   * @description This test case verifies that a BadRequestError can be created with a custom message.
   */
  it('should create a BadRequestError with a custom message', () => {
    const error = new BadRequestError('Custom bad request');
    expect(error).toBeInstanceOf(BadRequestError);
    expect(error.message).toBe('Custom bad request');
    expect(error.statusCode).toBe(400);
  });

  /**
   * @description This test case verifies that a MethodNotAllowedError can be created.
   */
  it('should create a MethodNotAllowedError', () => {
    const error = new MethodNotAllowedError();
    expect(error).toBeInstanceOf(MethodNotAllowedError);
    expect(error.message).toBe('Method Not Allowed');
    expect(error.statusCode).toBe(405);
  });
});