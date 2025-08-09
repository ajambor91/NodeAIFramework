import { RegisterValidator } from '../../validation/validators';
import { BadRequestError } from '../../errors/errors';

/**
 * @fileoverview This file contains the test suite for the RegisterValidator class.
 */
describe('RegisterValidator', () => {
  let validator: RegisterValidator;

  /**
   * @description This function is executed before each test case.
   */
  beforeEach(() => {
    validator = new RegisterValidator();
  });

  /**
   * @description This test case verifies that no error is thrown for valid data.
   */
  it('should not throw an error for valid data', () => {
    const data = { email: 'test@test.com', password: 'password1' };
    expect(() => validator.validate(data)).not.toThrow();
  });

  /**
   * @description This test case verifies that an error is thrown for an invalid email.
   */
  it('should throw an error for an invalid email', () => {
    const data = { email: 'test', password: 'password1' };
    expect(() => validator.validate(data)).toThrow(BadRequestError);
    expect(() => validator.validate(data)).toThrow('Invalid email format');
  });

  /**
   * @description This test case verifies that an error is thrown for a short password.
   */
  it('should throw an error for a short password', () => {
    const data = { email: 'test@test.com', password: '123' };
    expect(() => validator.validate(data)).toThrow(BadRequestError);
    expect(() => validator.validate(data)).toThrow('Password must be longer than 5 characters');
  });

  /**
   * @description This test case verifies that an error is thrown for a password without a letter.
   */
  it('should throw an error for a password without a letter', () => {
    const data = { email: 'test@test.com', password: '123456' };
    expect(() => validator.validate(data)).toThrow(BadRequestError);
    expect(() => validator.validate(data)).toThrow('Password must contain at least one letter and one number');
  });

  /**
   * @description This test case verifies that an error is thrown for a password without a number.
   */
  it('should throw an error for a password without a number', () => {
    const data = { email: 'test@test.com', password: 'password' };
    expect(() => validator.validate(data)).toThrow(BadRequestError);
    expect(() => validator.validate(data)).toThrow('Password must contain at least one letter and one number');
  });
});