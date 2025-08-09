import { JWTService } from '../../jwt/JWTService';
import jwt from 'jsonwebtoken';

/**
 * @fileoverview This file contains the test suite for the JWTService class.
 */
describe('JWTService', () => {
  let jwtService: JWTService;

  /**
   * @description This function is executed before each test case.
   */
  beforeEach(() => {
    jwtService = new JWTService();
  });

  /**
   * @description This test case verifies that a token can be generated.
   */
  it('should generate a token', () => {
    const payload = { userId: 1 };
    const token = jwtService.generateToken(payload);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { userId: number };
    expect(decoded.userId).toBe(payload.userId);
  });

  /**
   * @description This test case verifies that the default secret is used if the JWT_SECRET environment variable is not set.
   */
  it('should use the default secret if JWT_SECRET is not set', () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    const service = new JWTService();
    const payload = { userId: 1 };
    const token = service.generateToken(payload);
    const decoded = jwt.verify(token, 'default-secret') as { userId: number };
    expect(decoded.userId).toBe(payload.userId);
    process.env.JWT_SECRET = originalSecret;
  });
});