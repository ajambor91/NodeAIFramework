import crypto from 'crypto';
import { Service } from '../di/di';

/**
 * @class PasswordEncoder
 * @description A service for hashing and comparing passwords.
 */
@Service()
export class PasswordEncoder {
  private readonly pepper: string;

  /**
   * @constructor
   * @description Initializes the pepper from environment variables or a default value.
   */
  constructor() {
    this.pepper = process.env.PASSWORD_PEPPER || 'default-pepper';
  }

  /**
   * @method hash
   * @description Hashes a password with a salt and pepper.
   * @param {string} password - The password to hash.
   * @param {string} salt - The salt to use for hashing.
   * @returns {string} The hashed password.
   */
  hash(password: string, salt: string): string {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password + this.pepper);
    return hash.digest('hex');
  }

  /**
   * @method compare
   * @description Compares a password to a hashed password.
   * @param {string} password - The password to compare.
   * @param {string} salt - The salt used to hash the password.
   * @param {string} hashedPassword - The hashed password to compare against.
   * @returns {boolean} True if the password matches the hash, false otherwise.
   */
  compare(password: string, salt: string, hashedPassword: string): boolean {
    return this.hash(password, salt) === hashedPassword;
  }

  /**
   * @method generateSalt
   * @description Generates a random salt.
   * @returns {string} The generated salt.
   */
  generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}