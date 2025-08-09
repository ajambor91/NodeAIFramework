import { Service } from '../di/di';
import jwt from 'jsonwebtoken';

/**
 * @class JWTService
 * @description A service for generating JWT tokens.
 */
@Service()
export class JWTService {
  private readonly secret: string;

  /**
   * @constructor
   * @description Initializes the secret from environment variables or a default value.
   */
  constructor() {
    this.secret = process.env.JWT_SECRET || 'default-secret';
  }

  /**
   * @method generateToken
   * @description Generates a JWT token.
   * @param {object} payload - The payload to include in the token.
   * @returns {string} The generated token.
   */
  public generateToken(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: '1h' });
  }
}