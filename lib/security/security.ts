import 'reflect-metadata';
import { IncomingMessage } from 'http';
import { InvalidCredentialsError } from '../errors/errors';
import jwt from 'jsonwebtoken';

/**
 * @interface Security
 * @description An interface for security implementations.
 */
export interface Security {
  /**
   * @method authenticate
   * @description Authenticates a request.
   * @param {IncomingMessage} req - The request object.
   */
  authenticate(req: IncomingMessage): void;
}

/**
 * @class JWTSecurity
 * @description A security implementation that uses JWT tokens.
 * @implements Security
 */
export class JWTSecurity implements Security {
  /**
   * @method authenticate
   * @description Authenticates a request using a JWT token.
   * @param {IncomingMessage} req - The request object.
   */
  public authenticate(req: IncomingMessage): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new InvalidCredentialsError();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new InvalidCredentialsError();
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    } catch (error) {
      throw new InvalidCredentialsError();
    }
  }
}

/**
 * @decorator Security
 * @description A method decorator that applies a security implementation to a route.
 * @param {new () => Security} security - The security implementation to use.
 * @returns {MethodDecorator}
 */
export const Security = (security: new () => Security): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('security', security, target.constructor, propertyKey as string);
  };
};