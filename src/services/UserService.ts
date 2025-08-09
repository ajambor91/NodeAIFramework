import { Service } from '../../lib/di/di';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDto, User, UserResponseDto } from '../types/user';
import { PasswordEncoder } from '../../lib/crypto/PasswordEncoder';
import { ObjectId } from 'mongodb';
import { JWTService } from '../../lib/jwt/JWTService';
import { Logger } from '../../lib/logger/Logger';
import { UserNotFoundError, InvalidCredentialsError, UserAlreadyExistsError } from '../../lib/errors/errors';

/**
 * @class UserService
 * @description A service for managing users.
 */
@Service()
export class UserService {
  private readonly logger: Logger;

  /**
   * @constructor
   * @param {UserRepository} userRepository - The user repository.
   * @param {PasswordEncoder} passwordEncoder - The password encoder.
   * @param {JWTService} jwtService - The JWT service.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtService: JWTService
  ) {
    this.logger = Logger.getInstance();
  }

  /**
   * @method toUserResponseDto
   * @description Converts a User object to a UserResponseDto object.
   * @param {User} user - The user to convert.
   * @returns {UserResponseDto} The converted user.
   */
  private toUserResponseDto(user: User): UserResponseDto {
    return {
      _id: user._id.toHexString(),
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }

  /**
   * @method findAll
   * @description Finds all users.
   * @returns {Promise<UserResponseDto[]>} A list of all users.
   */
  public async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(this.toUserResponseDto);
  }

  /**
   * @method createUser
   * @description Creates a new user.
   * @param {CreateUserDto} data - The user data.
   * @returns {Promise<{ id: ObjectId; email: string; createdAt: Date }>} The newly created user.
   */
  public async createUser(
    data: CreateUserDto
  ): Promise<{ id: ObjectId; email: string; createdAt: Date }> {
    this.logger.info(`Creating user with email: ${data.email}`);
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }
    const salt = this.passwordEncoder.generateSalt();
    const hashedPassword = this.passwordEncoder.hash(data.password, salt);

    const userId = await this.userRepository.save({
      email: data.email,
      hashedPassword,
      salt,
    });

    this.logger.info(`User created with ID: ${userId}`);
    return {
      id: userId,
      email: data.email,
      createdAt: new Date(),
    };
  }

  /**
   * @method login
   * @description Logs in a user.
   * @param {CreateUserDto} data - The user credentials.
   * @returns {Promise<{ user: UserResponseDto; jwt: string }>} The logged in user and a JWT token.
   */
  public async login(
    data: CreateUserDto
  ): Promise<{ user: UserResponseDto; jwt: string }> {
    this.logger.info(`Login attempt for email: ${data.email}`);
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      this.logger.warn(`Login failed: User not found for email: ${data.email}`);
      throw new UserNotFoundError();
    }

    const isPasswordValid = this.passwordEncoder.compare(
      data.password,
      user.salt,
      user.hashedPassword
    );

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for email: ${data.email}`);
      throw new InvalidCredentialsError();
    }

    const token = this.jwtService.generateToken({
      sub: user._id.toHexString(),
      email: user.email,
    });

    this.logger.info(`Login successful for email: ${data.email}`);
    return {
      user: this.toUserResponseDto(user),
      jwt: token,
    };
  }

  /**
   * @method getUserById
   * @description Gets a user by their ID.
   * @param {string} id - The user ID.
   * @returns {Promise<UserResponseDto>} The user.
   */
  public async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.toUserResponseDto(user);
  }
}