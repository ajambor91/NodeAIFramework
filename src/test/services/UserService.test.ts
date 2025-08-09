import { UserService } from '../../services/UserService';
import { UserRepository } from '../../repositories/UserRepository';
import { PasswordEncoder } from '../../../lib/crypto/PasswordEncoder';
import { JWTService } from '../../../lib/jwt/JWTService';
import { UserNotFoundError, InvalidCredentialsError, UserAlreadyExistsError } from '../../../lib/errors/errors';
import { ObjectId } from 'mongodb';

jest.mock('../../repositories/UserRepository');
jest.mock('../../../lib/crypto/PasswordEncoder');
jest.mock('../../../lib/jwt/JWTService');

/**
 * @fileoverview This file contains the test suite for the UserService class.
 */
describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockPasswordEncoder: jest.Mocked<PasswordEncoder>;
  let mockJwtService: jest.Mocked<JWTService>;

  /**
   * @description This function is executed before each test case.
   */
  beforeEach(() => {
    mockUserRepository = new (UserRepository as any)();
    mockPasswordEncoder = new (PasswordEncoder as any)();
    mockJwtService = new (JWTService as any)();
    userService = new UserService(mockUserRepository, mockPasswordEncoder, mockJwtService);
  });

  /**
   * @description This test case verifies that all users can be found.
   */
  it('should find all users', async () => {
    const users = [{ _id: new ObjectId(), email: 'test@test.com', createdAt: new Date() }];
    mockUserRepository.findAll.mockResolvedValue(users as any);
    const result = await userService.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('test@test.com');
  });

  /**
   * @description This test case verifies that a user can be created.
   */
  it('should create a user', async () => {
    const user = { email: 'test@test.com', password: 'password1' };
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockPasswordEncoder.generateSalt.mockReturnValue('salt');
    mockPasswordEncoder.hash.mockReturnValue('hash');
    mockUserRepository.save.mockResolvedValue(new ObjectId());
    const result = await userService.createUser(user);
    expect(result.email).toBe('test@test.com');
  });

  /**
   * @description This test case verifies that an error is thrown if a user already exists.
   */
  it('should throw an error if user already exists', async () => {
    const user = { email: 'test@test.com', password: 'password1' };
    mockUserRepository.findByEmail.mockResolvedValue({} as any);
    await expect(userService.createUser(user)).rejects.toThrow(UserAlreadyExistsError);
  });

  /**
   * @description This test case verifies that a user can be logged in.
   */
  it('should login a user', async () => {
    const user = { email: 'test@test.com', password: 'password1' };
    const dbUser = { _id: new ObjectId(), email: 'test@test.com', salt: 'salt', hashedPassword: 'hash', createdAt: new Date() };
    mockUserRepository.findByEmail.mockResolvedValue(dbUser as any);
    mockPasswordEncoder.compare.mockReturnValue(true);
    mockJwtService.generateToken.mockReturnValue('token');
    const result = await userService.login(user);
    expect(result.jwt).toBe('token');
  });

  /**
   * @description This test case verifies that an error is thrown for a user not found on login.
   */
  it('should throw an error for a user not found on login', async () => {
    const user = { email: 'test@test.com', password: 'password1' };
    mockUserRepository.findByEmail.mockResolvedValue(null);
    await expect(userService.login(user)).rejects.toThrow(UserNotFoundError);
  });

  /**
   * @description This test case verifies that an error is thrown for an invalid password on login.
   */
  it('should throw an error for an invalid password on login', async () => {
    const user = { email: 'test@test.com', password: 'password1' };
    const dbUser = { _id: new ObjectId(), email: 'test@test.com', salt: 'salt', hashedPassword: 'hash', createdAt: new Date() };
    mockUserRepository.findByEmail.mockResolvedValue(dbUser as any);
    mockPasswordEncoder.compare.mockReturnValue(false);
    await expect(userService.login(user)).rejects.toThrow(InvalidCredentialsError);
  });

  /**
   * @description This test case verifies that a user can be retrieved by their ID.
   */
  it('should get a user by id', async () => {
    const id = new ObjectId();
    const user = { _id: id, email: 'test@test.com', createdAt: new Date() };
    mockUserRepository.findById.mockResolvedValue(user as any);
    const result = await userService.getUserById(id.toHexString());
    expect(result.email).toBe('test@test.com');
  });

  /**
   * @description This test case verifies that an error is thrown if a user is not found by their ID.
   */
  it('should throw an error if user is not found by id', async () => {
    const id = new ObjectId();
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(userService.getUserById(id.toHexString())).rejects.toThrow(UserNotFoundError);
  });
});