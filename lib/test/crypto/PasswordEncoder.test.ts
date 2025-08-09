import { PasswordEncoder } from '../../crypto/PasswordEncoder';

/**
 * @fileoverview This file contains the test suite for the PasswordEncoder class.
 */
describe('PasswordEncoder', () => {
  let passwordEncoder: PasswordEncoder;

  /**
   * @description This function is executed before each test case.
   */
  beforeEach(() => {
    passwordEncoder = new PasswordEncoder();
  });

  /**
   * @description This test case verifies that the generateSalt method returns a valid salt.
   */
  it('should generate a salt', () => {
    const salt = passwordEncoder.generateSalt();
    expect(salt).toBeDefined();
    expect(typeof salt).toBe('string');
    expect(salt.length).toBe(32);
  });

  /**
   * @description This test case verifies that the hash method returns a valid hash.
   */
  it('should hash a password', () => {
    const salt = passwordEncoder.generateSalt();
    const hashedPassword = passwordEncoder.hash('password', salt);
    expect(hashedPassword).toBeDefined();
    expect(typeof hashedPassword).toBe('string');
  });

  /**
   * @description This test case verifies that the compare method returns true for a correct password.
   */
  it('should compare a password to a hash', () => {
    const salt = passwordEncoder.generateSalt();
    const hashedPassword = passwordEncoder.hash('password', salt);
    const result = passwordEncoder.compare('password', salt, hashedPassword);
    expect(result).toBe(true);
  });

  /**
   * @description This test case verifies that the compare method returns false for an incorrect password.
   */
  it('should return false for a wrong password', () => {
    const salt = passwordEncoder.generateSalt();
    const hashedPassword = passwordEncoder.hash('password', salt);
    const result = passwordEncoder.compare('wrongpassword', salt, hashedPassword);
    expect(result).toBe(false);
  });
});