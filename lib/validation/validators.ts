import { CreateUserDto } from '../../src/types/user';
import { BadRequestError } from '../errors/errors';

/**
 * @interface Validator
 * @description An interface for validators.
 */
export interface Validator {
  /**
   * @method validate
   * @description Validates the given data.
   * @param {any} data - The data to validate.
   */
  validate(data: any): void;
}

/**
 * @class RegisterValidator
 * @description A validator for the registration data.
 * @implements Validator
 */
export class RegisterValidator implements Validator {
  /**
   * @method validate
   * @description Validates the registration data.
   * @param {CreateUserDto} data - The registration data.
   */
  public validate(data: CreateUserDto): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new BadRequestError('Invalid email format');
    }

    if (data.password.length <= 5) {
      throw new BadRequestError('Password must be longer than 5 characters');
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(data.password)) {
      throw new BadRequestError('Password must contain at least one letter and one number');
    }
  }
}