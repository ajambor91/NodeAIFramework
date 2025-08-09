import 'reflect-metadata';
import { JWTSecurity, Security } from '../../security/security';
import { IncomingMessage } from 'http';
import { Writable } from 'stream';
import { InvalidCredentialsError } from '../../errors/errors';
import jwt from 'jsonwebtoken';

class TestController {
  @Security(JWTSecurity)
  public testMethod() {}
}

/**
 * @fileoverview This file contains the test suite for the security implementations.
 */
describe('Security', () => {
  let mockRequest: IncomingMessage;
  let mockSocket: Writable;

  /**
   * @description This function is executed before each test case.
   */
  beforeEach(() => {
    mockSocket = new Writable();
    mockRequest = new IncomingMessage(mockSocket as any);
  });

  /**
   * @description This test case verifies that an error is thrown if the authorization header is missing.
   */
  it('should throw an error if the authorization header is missing', () => {
    const jwtSecurity = new JWTSecurity();
    expect(() => jwtSecurity.authenticate(mockRequest)).toThrow(InvalidCredentialsError);
  });

  /**
   * @description This test case verifies that an error is thrown if the token is missing.
   */
  it('should throw an error if the token is missing', () => {
    mockRequest.headers.authorization = 'Bearer ';
    const jwtSecurity = new JWTSecurity();
    expect(() => jwtSecurity.authenticate(mockRequest)).toThrow(InvalidCredentialsError);
  });

  /**
   * @description This test case verifies that an error is thrown if the token is invalid.
   */
  it('should throw an error if the token is invalid', () => {
    mockRequest.headers.authorization = 'Bearer invalidtoken';
    const jwtSecurity = new JWTSecurity();
    expect(() => jwtSecurity.authenticate(mockRequest)).toThrow(InvalidCredentialsError);
  });

  /**
   * @description This test case verifies that no error is thrown if the token is valid.
   */
  it('should not throw an error if the token is valid', () => {
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'default-secret');
    mockRequest.headers.authorization = `Bearer ${token}`;
    const jwtSecurity = new JWTSecurity();
    expect(() => jwtSecurity.authenticate(mockRequest)).not.toThrow();
  });

  /**
   * @description This test case verifies that the Security decorator defines the correct metadata.
   */
  it('should define security metadata', () => {
    const security = Reflect.getMetadata('security', TestController, 'testMethod');
    expect(security).toBe(JWTSecurity);
  });
});